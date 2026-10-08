import express from "express";
import { orderController } from "../controllers/order.controller.ts";

const router = express.Router();

router.get("/getOrders", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);

export default router;
