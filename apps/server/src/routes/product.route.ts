import express, { type Router } from "express";
import {
	createProduct,
	deleteProduct,
	getProduct,
	getProducts,
	updateProduct,
} from "../controllers/product.controller";
import {
	adminMiddleware,
	authMiddleware,
} from "../middlewares/auth.middleware";
import { validateQuery } from "../middlewares/validate.middleware";
import { z } from "zod";

const router: Router = express.Router();

const ProductQuerySchema = z.object({
	search: z.string().optional(),
	categoryId: z.string().optional(),
	minPrice: z.coerce.number().optional(),
	maxPrice: z.coerce.number().optional(),
	brands: z.string().optional().transform(val => val?.split(',')),
	features: z.string().optional().transform(val => val?.split(',')),
	sortBy: z.enum(['featured', 'price-asc', 'price-desc', 'rating', 'newest']).optional(),
	page: z.coerce.number().optional().default(1),
	limit: z.coerce.number().optional().default(12),
}).passthrough();

router.get("/", validateQuery(ProductQuerySchema), getProducts);
router.get("/:id", getProduct);
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
