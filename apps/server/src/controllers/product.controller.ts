import {
	categories,
	db,
	eq,
	products,
	sql,
	and,
	like,
	gte,
	lte,
} from "@bytemart/database";
import {
	CategorySchema,
	ProductSchema,
	type ProductFilters,
} from "@bytemart/types";
import type { Request, Response } from "express";
import { handleError } from "../utils";
import ApiError from "../utils/api-error";

export const createProduct = async (req: Request, res: Response) => {
	try {
		if (req.user.role !== "admin") {
			throw ApiError.forbidden("Only admins can create products");
		}

		const validatedData = ProductSchema.parse(req.body);

		const product = await db.insert(products).values({
			name: validatedData.name,
			description: validatedData.description || "",
			price: String(validatedData.price) || "",
			stock_quantity: validatedData.stockQuantity,
			category_id: validatedData.categoryId || null,
			image_url: validatedData.imageUrl || "",
		});

		res.status(201).json({
			success: true,
			data: product,
		});
	} catch (error) {
		handleError(error, res);
	}
};

export const getProducts = async (req: Request, res: Response) => {
	try {
		const filters = req.query as unknown as ProductFilters;
		const page = Number(filters.page) || 1;
		const limit = Number(filters.limit) || 12;
		const offset = (page - 1) * limit;

		const whereConditions = [];

		if (filters.search) {
			whereConditions.push(like(products.name, `%${filters.search}%`));
		}

		if (filters.categoryId) {
			whereConditions.push(eq(products.category_id, filters.categoryId));
		}

		if (filters.minPrice !== undefined) {
			whereConditions.push(
				gte(sql`CAST(${products.price} AS DECIMAL)`, filters.minPrice),
			);
		}

		if (filters.maxPrice !== undefined) {
			whereConditions.push(
				lte(sql`CAST(${products.price} AS DECIMAL)`, filters.maxPrice),
			);
		}

		let orderBy;
		switch (filters.sortBy) {
			case "price-asc":
				orderBy = sql`CAST(${products.price} AS DECIMAL) ASC`;
				break;
			case "price-desc":
				orderBy = sql`CAST(${products.price} AS DECIMAL) DESC`;
				break;
			case "newest":
				orderBy = sql`${products.created_at} DESC`;
				break;
			case "rating":
				orderBy = sql`${products.rating} DESC`;
				break;
			default:
				orderBy = sql`${products.created_at} DESC`; 
		}
		const totalCountResult = await db
			.select({ count: sql<number>`count(*)` })
			.from(products)
			.where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

		const total = totalCountResult[0]?.count || 0;

		const filteredProducts = await db.query.products.findMany({
			where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
			with: {
				category: true,
			},
			limit,
			offset,
			orderBy: orderBy,
		});

		res.json({
			success: true,
			data: {
				items: filteredProducts,
				total,
				page,
				limit,
			},
		});
	} catch (error) {
		handleError(error, res);
	}
};

export const getProduct = async (req: Request, res: Response) => {
	try {
		const product = await db.query.products.findFirst({
			where: eq(products.id, req.params.id as string),
			with: {
				category: true,
			},
		});

		if (!product) {
			throw ApiError.notFound("Product not found");
		}

		res.json({
			success: true,
			data: product,
		});
	} catch (error) {
		handleError(error, res);
	}
};

export const updateProduct = async (req: Request, res: Response) => {
	try {
		if (req.user.role !== "admin") {
			throw ApiError.forbidden("Only admins can update products");
		}

		const productId = req.params.id as string;
		const validatedData = ProductSchema.partial().parse(req.body);

		const updateData: Record<string, any> = {};
		if (validatedData.name !== undefined) updateData.name = validatedData.name;
		if (validatedData.description !== undefined)
			updateData.description = validatedData.description;
		if (validatedData.price !== undefined)
			updateData.price = validatedData.price.toString();
		if (validatedData.stockQuantity !== undefined)
			updateData.stock_quantity = validatedData.stockQuantity;
		if (validatedData.categoryId !== undefined)
			updateData.category_id = validatedData.categoryId;
		if (validatedData.imageUrl !== undefined)
			updateData.image_url = validatedData.imageUrl;

		if (Object.keys(updateData).length === 0) {
			return res.status(400).json({
				success: false,
				message: "No valid fields provided for update",
			});
		}
		const existingProduct = await db.query.products.findFirst({
			where: eq(products.id, productId),
		});
		if (!existingProduct) {
			throw ApiError.notFound("Product not found");
		}
		await db.update(products).set(updateData).where(eq(products.id, productId));
		const updatedProduct = await db.query.products.findFirst({
			where: eq(products.id, productId),
		});
		res.json({
			success: true,
			message: "Product updated successfully",
			data: updatedProduct,
		});
	} catch (error) {
		handleError(error, res);
	}
};

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		if (req.user.role !== "admin") {
			throw ApiError.forbidden("Only admins can delete products");
		}

		await db.delete(products).where(eq(products.id, req.params.id as string));

		res.json({
			success: true,
			message: "Product deleted successfully",
		});
	} catch (error) {
		handleError(error, res);
	}
};
