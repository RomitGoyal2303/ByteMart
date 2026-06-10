import {
  db,
  orders,
  orderItems,
  eq,
  and,
  desc,
  sql,
  products,
} from "@bytemart/database";
import type { Request, Response } from "express";
import { z } from "zod";
import { handleError } from "../utils";
import ApiError from "../utils/api-error";

const OrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema),
  shippingAddressId: z.string(),
});

const UpdateOrderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateOrderSchema.parse(req.body);
    
    let total = 0;
    for (const item of validatedData.items) {
      total += item.price * item.quantity;
      
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.productId),
      });
      
      if (!product) {
        throw ApiError.notFound(`Product with ID ${item.productId} not found`);
      }
      
      if (product.stock_quantity < item.quantity) {
        throw ApiError.badRequest(
          `Not enough stock for product ${product.name}. Requested: ${item.quantity}, Available: ${product.stock_quantity}`
        );
      }
    }
    console.log("Total price:", total);
    console.log("Shipping address ID:", validatedData.shippingAddressId);
    console.log("User ID:", req.user.id);
    const [orderResult] = await db
      .insert(orders)
      .values({
        customer_id: req.user.id,
        status: "pending",
        total: total.toString(),
        shipping_address_id: validatedData.shippingAddressId,
      })
      .$returningId();
    
    if (!orderResult) {
      throw ApiError.badRequest("Failed to create order");
    }
    
    const orderItemsToInsert = validatedData.items.map((item) => ({
      order_id: orderResult.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price.toString(),
    }));
    
    await db.insert(orderItems).values(orderItemsToInsert);
    
    for (const item of validatedData.items) {
      await db
        .update(products)
        .set({
          stock_quantity: sql`stock_quantity - ${item.quantity}`,
        })
        .where(eq(products.id, item.productId));
    }
    
    const createdOrder = await db.query.orders.findFirst({
      where: eq(orders.id, orderResult.id),
      with: {
        items: {
          with: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });
    
    res.status(201).json({
      success: true,
      data: createdOrder,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const isAdmin = req.user.role === "admin";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    let whereCondition;
    if (isAdmin) {
      whereCondition = undefined;
    } else {
      whereCondition = eq(orders.customer_id, req.user.id);
    }
    
    const userOrders = await db.query.orders.findMany({
      where: whereCondition,
      with: {
        items: {
          with: {
            product: {
              columns: {
                id: true,
                name: true,
                image_url: true,
              },
            },
          },
        },
      },
      limit,
      offset,
      orderBy: [desc(orders.created_at)],
    });
    
    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(orders)
      .where(whereCondition || sql`1=1`);
    
    const total = countResult[0]?.count || 0;
    
    res.json({
      success: true,
      data: {
        orders: userOrders,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    if(!orderId) {
        throw ApiError.badRequest("Order ID is required");
    }
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: {
          with: {
            product: true,
          },
        },
        shippingAddress: true,
        customer: true,
      },
    });
    
    if (!order) {
      throw ApiError.notFound("Order not found");
    }
    
    if (req.user.role !== "admin" && order.customer_id !== req.user.id) {
      throw ApiError.forbidden("You don't have permission to view this order");
    }
    
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const { status } = UpdateOrderStatusSchema.parse(req.body);

    if (!orderId) {
      throw ApiError.badRequest("Order ID is required");
    }

    if (req.user.role !== "admin") {
      throw ApiError.forbidden("Only administrators can update order status");
    }
    
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });
    
    if (!existingOrder) {
      throw ApiError.notFound("Order not found");
    }
    
    if (status === "cancelled" && existingOrder.status !== "cancelled") {
      const oItem = await db.query.orderItems.findMany({
        where: eq(orderItems.order_id, orderId),
      });
      
      for (const item of oItem) {
        await db
          .update(products)
          .set({
            stock_quantity: sql`stock_quantity + ${item.quantity}`,
          })
          .where(eq(products.id, item.product_id));
      }
    }
    
    await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId));
    
    const updatedOrder = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });
    
    res.json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    handleError(error, res);
  }
};
