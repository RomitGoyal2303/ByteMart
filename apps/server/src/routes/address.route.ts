import express, { type Router } from "express";
import {
  createAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../controllers/address.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.use(authMiddleware);

router.get("/", getAddresses);
router.get("/:id", getAddress);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);
router.patch("/:id/default", setDefaultAddress);

export default router;
