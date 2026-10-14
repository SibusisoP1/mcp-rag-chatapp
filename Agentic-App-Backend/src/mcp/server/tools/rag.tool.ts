import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import z from "zod";
import { RagEngine } from "../../../rag/ragEngine.ts";

export function registerRAGTools(server: McpServer) {
  console.log("Registering RAG tools...");

  //tool 1:get orders
  server.registerTool(
    "ragSearch",
    {
      title: "RAG Search",
      description: "Retrieve relevant context from vector store for user query",
      inputSchema: {
        query: z.string(),
        topK: z.number().optional(),
      },
      outputSchema: {
        prompt: z.string(), //Rag prompt for LLM to continue
        sources: z.any(), //metadata + chunks
      },
    },
    async ({ query, topK }) => {
      console.log("rag query:", query);

      try {
        const result = await RagEngine.buildPrompt(query, topK);

        return {
          content: [{ type: "text", text: result.prompt }],
          structuredContent: { prompt: result.prompt, sources: result },
        };
      } catch (error: any) {
        console.error("RAG TOOL ERROR:", error);

        return {
          content: [{ type: "text", text: "RAG ERROR" }],
          structuredContent: {
            prompt: JSON.stringify(error.message),
            sources: [],
          },
        };
      }
    },
  );
}
