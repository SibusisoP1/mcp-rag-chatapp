import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";
import type { Request, Response } from "express";
import { createMCPServer } from "../mcp/server/mcpServer.ts";
import { randomUUID } from "crypto";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types";

const mcpServer = createMCPServer();

//toogle session state
const USE_SESSION = true;

//store session per transport (only when USE_SESSION is true)
const sessionTransports: Record<string, StreamableHTTPServerTransport> = {};

export class McpServerTransportController {
  private static getSessionTransport(sessionId?: string) {
    if (!USE_SESSION) return null;

    return sessionId ? sessionTransports[sessionId] : null;
  }

  private static createTransport() {
    const transport = new StreamableHTTPServerTransport({
      ...(USE_SESSION ? { sessionIdGenerator: () => randomUUID() } : {}),
      enableJsonResponse: true,
      onsessioninitialized: (sessionId) => {
        if (USE_SESSION) {
          sessionTransports[sessionId] = transport;
        }
      },
    });

    //cleanup session transport on close
    //to prevent memory leaks when using sessions
    if (USE_SESSION) {
      transport.onclose = () => {
        if (transport.sessionId) {
          delete sessionTransports[transport.sessionId];
        }
      };
    }

    return transport;
  }

  //post request handler for mcp server transport to client

  static async handleRequest(req: Request, res: Response) {
    //check for existing session id
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    let transport = McpServerTransportController.getSessionTransport(sessionId);

    if (USE_SESSION) {
      //if no transport exists for the session, create a new one
      if (!transport && isInitializeRequest(req.body)) {
        console.log("Creating new transport for session:", sessionId);
        transport = McpServerTransportController.createTransport();

        //connect transport to mcp server
        await mcpServer.connect(
          transport as Parameters<typeof mcpServer.connect>[0],
        );
      }

      //missing or invalid session id
      if (!transport) {
        return res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Missing or invalid session id",
          },
          id: null,
        });
      }
    }

    if (!USE_SESSION) {
      //create a new transport for each request
      transport = McpServerTransportController.createTransport();

      //connect transport to mcp server
      await mcpServer.connect(
        transport as Parameters<typeof mcpServer.connect>[0],
      );
    }

    if (!transport) {
      return res.status(500).send("Failed to create transport");
    }

    //handle the request
    await transport!.handleRequest(req, res, req.body);
  }

  //Get request handler for mcp server transport to client
  static async handleGetRequest(req: Request, res: Response) {
    if (!USE_SESSION) {
      return res
        .status(400)
        .send("GET requests are not supported when USE_SESSION is false");
    }
    //check for existing session id
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    const transport =
      McpServerTransportController.getSessionTransport(sessionId);

    if (!transport) {
      return res.status(400).send("Missing or invalid session id");
    }

    await transport.handleRequest(req, res);
  }

  //Delete request handler for mcp server transport to client
  static async handleDeleteRequest(req: Request, res: Response) {
    if (!USE_SESSION) {
      return res
        .status(400)
        .send("DELETE requests are not supported when USE_SESSION is false");
    }
    //check for existing session id
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    const transport =
      McpServerTransportController.getSessionTransport(sessionId);

    if (!transport) {
      return res.status(400).send("Missing or invalid session id");
    }

    await transport.handleRequest(req, res);
  }
}
