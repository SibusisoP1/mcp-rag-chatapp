import type { Request, Response } from "express";
import { MOCK_CUSTOMERS } from "../data/customers.data.ts";
import { customerService } from "../services/customer.service.ts";

export class customerController {
  static getAllCustomers = async (req: Request, res: Response) => {
    try {
      const { limit } = req.query;

      const customers = await customerService.getLatestCustomers(
        limit ? Number(limit) : undefined,
      );

      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static getCustomerById = (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (typeof id !== "string") {
        res.status(400).json({ error: "Invalid customer ID" });
        return;
      }
      const customer = customerService.getCustomerById(id);
      if (!customer) {
        res.status(404).json({ error: "Customer not found" });
        return;
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
