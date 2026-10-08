import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { customerService } from "../../../services/customer.service.ts";

export function registerCustomerTools(server: McpServer) {
  console.log("Registering customer tools...");

  //tool 1:get customers
  server.registerTool(
    "getCustomers",
    {
      title: "fetch all customers",
      description: "fetch all customers from the json data based on limit",
      inputSchema: {
        limit: z.number().optional(),
      },
      outputSchema: {
        customers: z.array(
          z.object({
            _id: z.string(),
            name: z.string(),
            email: z.string(),
            joinedAt: z.string().optional(),
          }),
        ),
      },
    },
    async ({ limit }) => {
      console.log("Fetching customers data...");

      const customers = await customerService.getLatestCustomers(limit);

      return {
        content: [{ type: "text", text: JSON.stringify(customers, null, 2) }],
        structuredContent: { customers },
      };
    },
  );

  server.registerTool(
    "getCustomerById",
    {
      title: "fetch customer by id",
      description: "fetch customer by id from the json data",
      inputSchema: {
        id: z.string(),
      },
      outputSchema: {
        customer: z.object({
          _id: z.string(),
          name: z.string(),
          email: z.string(),
          joinedAt: z.string().optional(),
        }),
      },
    },
    async ({ id }) => {
      console.log("Fetching customer data by ID...");

      const customer = await customerService.getCustomerById(id);

      return {
        content: [{ type: "text", text: JSON.stringify(customer, null, 2) }],
        structuredContent: { customer },
      };
    },
  );
}
