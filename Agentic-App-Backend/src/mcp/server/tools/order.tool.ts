import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { orderService } from "../../../services/order.service.ts";

export function registerOrderTools(server: McpServer) {
  console.log("Registering order tools...");

  //tool 1:get orders
  server.registerTool(
    "getOrders",
    {
      title: "fetch all orders",
      description: "fetch all orders from the json data based on limit",
      inputSchema: {
        limit: z.number().optional(),
      },
      outputSchema: {
        orders: z.array(
          z.object({
            id: z.string(),
            product: z.string(),
            price: z.number(),
            customer_id: z.string(),
            date: z.string().optional(),
          }),
        ),
      },
    },
    async ({ limit }) => {
      console.log("Fetching orders data...");

      const orders = await orderService.getLatestOrders(limit);

      return {
        content: [{ type: "text", text: JSON.stringify(orders, null, 2) }],
        structuredContent: { orders },
      };
    },
  );

  //tool 2:get orders with customer details
  server.registerTool(
    "getOrdersWithCustomerDetails",
    {
      title: "fetch all orders with customer details",
      description:
        "fetch all orders with customer details (name) from the json data based on limit",
      inputSchema: {
        limit: z.number().optional(),
      },
      outputSchema: {
        orders: z.array(
          z.object({
            id: z.string(),
            product: z.string(),
            price: z.number(),
            customer_id: z.string(),
            date: z.string().optional(),
          }),
        ),
      },
    },
    async ({ limit }) => {
      console.log("Fetching orders with customer details...");

      const orders =
        await orderService.getLatestOrderswithCustomerDetails(limit);

      return {
        content: [{ type: "text", text: JSON.stringify(orders, null, 2) }],
        structuredContent: { orders },
      };
    },
  );

  //tool 3:get order by id
  server.registerTool(
    "getOrderById",
    {
      title: "fetch order by id",
      description: "fetch order by id from the json data",
      inputSchema: {
        id: z.string(),
      },
      outputSchema: {
        order: z.object({
          id: z.string(),
          product: z.string(),
          price: z.number(),
          customer_id: z.string(),
          date: z.string().optional(),
        }),
      },
    },
    async ({ id }) => {
      console.log("Fetching order by id...");

      const order = await orderService.getOrderById(id);

      return {
        content: [{ type: "text", text: JSON.stringify(order, null, 2) }],
        structuredContent: { order },
      };
    },
  );
}
