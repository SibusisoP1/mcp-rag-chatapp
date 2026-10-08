import express from "express";
import { customerController } from "../controllers/customer.controller.ts";

const router = express.Router();

router.get("/getCustomers", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);

export default router;
