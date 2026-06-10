"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.SignupSchema = exports.ReviewSchema = exports.CartItemSchema = exports.CartSchema = exports.OrderItemSchema = exports.OrderSchema = exports.OrderStatusEnum = exports.CategoryResponse = exports.CategoryResponseSchema = exports.CategorySchema = exports.ProductSchema = exports.AddressSchema = exports.UserSchema = exports.UserRoleEnum = void 0;
const zod_1 = require("zod");
exports.UserRoleEnum = {
    CUSTOMER: "customer",
    ADMIN: "admin",
};
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string(),
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    phone: zod_1.z.string().optional(),
    role: zod_1.z.enum([exports.UserRoleEnum.CUSTOMER, exports.UserRoleEnum.ADMIN]),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
});
exports.AddressSchema = zod_1.z.object({
    id: zod_1.z.string(),
    customerId: zod_1.z.string(),
    addressLine1: zod_1.z.string(),
    addressLine2: zod_1.z.string().optional(),
    city: zod_1.z.string(),
    state: zod_1.z.string(),
    postalCode: zod_1.z.string(),
    country: zod_1.z.string(),
    isDefault: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
});
exports.ProductSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.number(),
    stockQuantity: zod_1.z.number(),
    categoryId: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string(),
});
exports.CategorySchema = zod_1.z.object({
    name: zod_1.z.string(),
    parentId: zod_1.z.string().optional(),
});
exports.CategoryResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    parentId: zod_1.z.string().nullable(),
    slug: zod_1.z.string(),
    productCount: zod_1.z.number(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    children: zod_1.z.array(zod_1.z.any()),
});
exports.CategoryResponse = zod_1.z.object({
    parentCategories: zod_1.z.array(exports.CategorySchema),
    allCategories: zod_1.z.array(exports.CategoryResponseSchema),
});
exports.OrderStatusEnum = {
    PENDING: "pending",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
};
exports.OrderSchema = zod_1.z.object({
    id: zod_1.z.string(),
    customerId: zod_1.z.string(),
    status: zod_1.z.enum([
        exports.OrderStatusEnum.PENDING,
        exports.OrderStatusEnum.PROCESSING,
        exports.OrderStatusEnum.SHIPPED,
        exports.OrderStatusEnum.DELIVERED,
        exports.OrderStatusEnum.CANCELLED,
    ]),
    total: zod_1.z.number(),
    shippingAddressId: zod_1.z.string().optional(),
});
exports.OrderItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    orderId: zod_1.z.string(),
    productId: zod_1.z.string(),
    quantity: zod_1.z.number(),
    price: zod_1.z.number(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
});
exports.CartSchema = zod_1.z.object({
    id: zod_1.z.string(),
    customerId: zod_1.z.string(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
});
exports.CartItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    cartId: zod_1.z.string(),
    productId: zod_1.z.string(),
    quantity: zod_1.z.number(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
});
exports.ReviewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    productId: zod_1.z.string(),
    customerId: zod_1.z.string(),
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().optional(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
});
exports.SignupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    firstName: zod_1.z.string().min(2).regex(/^[a-zA-Z]+$/),
    lastName: zod_1.z.string(),
    phone: zod_1.z.string().min(10),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
