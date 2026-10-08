import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { registerCustomerTools } from "./tools/customer.tool.ts";
import { registerOrderTools } from "./tools/order.tool.ts";
import { registerWeatherTools } from "./tools/weather.tool.ts";

export function createMCPServer() {
  console.log("Creating MCP Server...");

  const server = new McpServer({
    name: "agentic-app",
    version: "1.0.0",
  });

  //register the tools
  registerCustomerTools(server);
  registerOrderTools(server);
  registerWeatherTools(server);

  return server;
}
