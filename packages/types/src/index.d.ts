import { z } from "zod";
import { InferSelectModel, products } from "@bytemart/database";
export declare const UserRoleEnum: {
    readonly CUSTOMER: "customer";
    readonly ADMIN: "admin";
};
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<["customer", "admin"]>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    role: "customer" | "admin";
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    phone?: string | undefined;
}, {
    id: string;
    email: string;
    role: "customer" | "admin";
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    phone?: string | undefined;
}>;
export declare const AddressSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    addressLine1: z.ZodString;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
    country: z.ZodString;
    isDefault: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    city: string;
    state: string;
    country: string;
    createdAt: string;
    updatedAt: string;
    customerId: string;
    addressLine1: string;
    postalCode: string;
    isDefault: boolean;
    addressLine2?: string | undefined;
}, {
    id: string;
    city: string;
    state: string;
    country: string;
    createdAt: string;
    updatedAt: string;
    customerId: string;
    addressLine1: string;
    postalCode: string;
    addressLine2?: string | undefined;
    isDefault?: boolean | undefined;
}>;
export declare const ProductSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    stockQuantity: z.ZodNumber;
    categoryId: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    categoryId?: string | undefined;
}, {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    categoryId?: string | undefined;
}>;
export declare const CategorySchema: z.ZodObject<{
    name: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    parentId?: string | undefined;
}, {
    name: string;
    parentId?: string | undefined;
}>;
export declare const CategoryResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    parentId: z.ZodNullable<z.ZodString>;
    slug: z.ZodString;
    productCount: z.ZodNumber;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    children: z.ZodArray<z.ZodAny, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    parentId: string | null;
    slug: string;
    productCount: number;
    children: any[];
}, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    parentId: string | null;
    slug: string;
    productCount: number;
    children: any[];
}>;
export declare const CategoryResponse: z.ZodObject<{
    parentCategories: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        parentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        parentId?: string | undefined;
    }, {
        name: string;
        parentId?: string | undefined;
    }>, "many">;
    allCategories: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        parentId: z.ZodNullable<z.ZodString>;
        slug: z.ZodString;
        productCount: z.ZodNumber;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        children: z.ZodArray<z.ZodAny, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        slug: string;
        productCount: number;
        children: any[];
    }, {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        slug: string;
        productCount: number;
        children: any[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    parentCategories: {
        name: string;
        parentId?: string | undefined;
    }[];
    allCategories: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        slug: string;
        productCount: number;
        children: any[];
    }[];
}, {
    parentCategories: {
        name: string;
        parentId?: string | undefined;
    }[];
    allCategories: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        slug: string;
        productCount: number;
        children: any[];
    }[];
}>;
export type CategoryResponse = z.infer<typeof CategoryResponse>;
export declare const OrderStatusEnum: {
    readonly PENDING: "pending";
    readonly PROCESSING: "processing";
    readonly SHIPPED: "shipped";
    readonly DELIVERED: "delivered";
    readonly CANCELLED: "cancelled";
};
export declare const OrderSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    status: z.ZodEnum<["pending", "processing", "shipped", "delivered", "cancelled"]>;
    total: z.ZodNumber;
    shippingAddressId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    total: number;
    customerId: string;
    shippingAddressId?: string | undefined;
}, {
    id: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    total: number;
    customerId: string;
    shippingAddressId?: string | undefined;
}>;
export declare const OrderItemSchema: z.ZodObject<{
    id: z.ZodString;
    orderId: z.ZodString;
    productId: z.ZodString;
    quantity: z.ZodNumber;
    price: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    price: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    orderId: string;
    productId: string;
}, {
    id: string;
    price: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    orderId: string;
    productId: string;
}>;
export declare const CartSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    updatedAt: string;
    customerId: string;
}, {
    id: string;
    createdAt: string;
    updatedAt: string;
    customerId: string;
}>;
export declare const CartItemSchema: z.ZodObject<{
    id: z.ZodString;
    cartId: z.ZodString;
    productId: z.ZodString;
    quantity: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    productId: string;
    cartId: string;
}, {
    id: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    productId: string;
    cartId: string;
}>;
export declare const ReviewSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    customerId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    customerId: string;
    productId: string;
    comment?: string | undefined;
}, {
    id: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    customerId: string;
    productId: string;
    comment?: string | undefined;
}>;
export declare const SignupSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    password: string;
}, {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    password: string;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type User = z.infer<typeof UserSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ProductResponse = {
    id: string;
    category: Category;
} & InferSelectModel<typeof products>;
export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};
export type PaginatedResponse<T> = ApiResponse<{
    items: T[];
    total: number;
    page: number;
    limit: number;
}>;
export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    maxQuantity: number;
    imageUrl: string;
}
export interface WishlistItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    imageUrl: string;
    category?: string;
    inStock?: boolean;
}
export interface Cart {
    items: CartItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}
export interface Wishlist {
    items: WishlistItem[];
}
export interface ProductFilters {
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    brands?: string[];
    features?: string[];
    sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
    page?: number;
    limit?: number;
}
export type ProductsResponse = PaginatedResponse<ProductResponse>;
//# sourceMappingURL=index.d.ts.map