import type { Request, Response } from "express";
import { MOCK_ORDERS } from "../data/orders.data.ts";
import { orderService } from "../services/order.service.ts";

export class orderController {
  static getAllOrders = async (req: Request, res: Response) => {
    try {
      const { limit } = req.query;

      const orders = await orderService.getLatestOrders(
        limit ? Number(limit) : undefined,
      );

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static getOrderById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (typeof id !== "string") {
        res.status(400).json({ error: "Invalid customer ID" });
        return;
      }

      const orders = await orderService.getOrderById(id);

      if (!orders) {
        res.status(404).json({ error: "Orders not found" });
        return;
      }

      res.json(orders);
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
