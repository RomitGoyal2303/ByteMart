import express, { type Router } from "express";
import { me, signin, signout, signup } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", authMiddleware, me);
router.post("/signout", authMiddleware, signout);

export default router;
