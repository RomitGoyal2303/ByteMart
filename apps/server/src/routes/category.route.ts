import express, { type Router } from "express";
import {
	createCategory,
	deleteCategory,
	getCategories,
	getParentCategories,
	updateCategory,
} from "../controllers/category.controller";
import {
	adminMiddleware,
	authMiddleware,
} from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.get("/", getCategories);
router.get("/parent", getParentCategories);
router.post("/", authMiddleware, adminMiddleware, createCategory);
router.put("/:id", authMiddleware, adminMiddleware, updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

export default router;
