import { response, type Request, type Response } from "express";
import { GEMINI } from "../services/gemini.service.ts";
import { MCPClient } from "../mcp/client/mcp.client.service.ts";
import { OPENAI } from "../services/openai.service.ts";

export class AgentController {
  static chat = async (req: Request, res: Response) => {
    const { message, model } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const selectedModel = model || "gemini";

    try {
      const mcp = MCPClient.init();
      if (selectedModel === "gemini") {
        const response = await GEMINI.generateResponseWithTools(
          message,
          (await mcp).client,
        );
        res.json({ reply: response });
      }

      if (selectedModel === "gpt") {
        const response = await OPENAI.generateResponseWithTools(
          message,
          (await mcp).client,
        );
        res.json({ reply: response });
      }
    } catch (error) {
      console.error("Error in /chat route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
