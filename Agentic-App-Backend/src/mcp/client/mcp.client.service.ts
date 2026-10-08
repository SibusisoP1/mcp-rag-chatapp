import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";

class MCPClientService {
  private static instance: MCPClientService;
  client: Client;
  private tools: any[] = [];
  private initialised = false;

  constructor() {
    this.client = new Client({
      name: "node-mcp-client",
      version: "1.0.0",
    });
  }

  static getInstance(): MCPClientService {
    if (!MCPClientService.instance) {
      MCPClientService.instance = new MCPClientService();
    }
    return MCPClientService.instance;
  }

  //connect to the MCP server
  async init(): Promise<MCPClientService> {
    if (this.initialised) return this;

    const url = `http://localhost:${process.env.PORT}/mcp`;
    const transport = new StreamableHTTPClientTransport(new URL(url)) as any;

    await this.client.connect(transport as any);
    this.initialised = true;
    return this;
  }

  //get tools
  async getTools() {
    await this.init();

    if (this.tools.length === 0) {
      const list = await this.client.listTools();
      this.tools = list.tools;
    }
    return this.tools;
  }

  //call specific tool by name with input arguments
  async callTool(name: string, args: Record<string, any>) {
    if (!this.initialised) await this.init();

    return await this.client.callTool({
      name,
      arguments: args,
    });
  }
}

export const MCPClient = MCPClientService.getInstance();
