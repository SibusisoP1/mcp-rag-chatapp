import { OpenAI } from "openai";
import { weatherService } from "./weather.service.ts";
import { customerService } from "./customer.service.ts";
import type {
  ResponseInput,
  Tool,
} from "openai/resources/responses/responses.js";
import type { Client } from "@modelcontextprotocol/sdk/client";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const JsonPrimitive = z.union([z.string(), z.number(), z.boolean(), z.null()]);

//JSON PARIMITIVE
const ToolArgumentSchema = z.record(z.string(), JsonPrimitive);

const ToolIntentSchema = z
  .object({
    action: z.enum(["final", "tool"]),
    tool: z.string().nullable(),
    arguments: ToolArgumentSchema.nullable(),
    output: z.string().nullable(),
  })
  .refine(
    (v) =>
      (v.action === "tool" && v.tool !== null && v.arguments !== null) ||
      (v.action === "final" && v.output !== null),
    { message: "Invalid Intent shape" },
  );

class OpenaiService {
  private static instance: OpenaiService;
  private readonly modelName: string;
  private readonly apiKey: string;
  private readonly Openai: OpenAI;
  private readonly MAX_STEPS = 6;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    const modelName = process.env.OPENAI_MODEL;

    if (!apiKey) {
      throw new Error("API key is required");
    }

    if (!modelName) {
      throw new Error("Model name is required");
    }

    this.modelName = modelName;
    this.apiKey = apiKey;

    this.Openai = new OpenAI({ apiKey: this.apiKey });
  }

  static getInstance(): OpenaiService {
    if (!this.instance) {
      this.instance = new OpenaiService();
    }
    return this.instance;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.Openai.responses.create({
        model: this.modelName,
        input: prompt,
      });
      return response.output_text || "No response generated from OpenAI API";
    } catch (error: any) {
      console.error("Error generating response from OpenAI API:", error);
      throw new Error("Failed to generate response from OpenAI API");
    }
  }

  async generateEmbeddings(data: string | string[]) {
    try {
      const response = await this.Openai.embeddings.create({
        model: "text-embedding-3-small",
        input: data,
        encoding_format: "float",
      });

      const embeddings = response.data?.map((e) => e.embedding) ?? [];
      return embeddings;
    } catch (error) {
      console.error("Error generating embedding from OpenAI API:", error);
      throw new Error("Failed to generate embedding from OpenAI API");
    }
  }

  async generateResponseWithTools(
    prompt: string,
    mcpClient: Client,
  ): Promise<string> {
    const mcpTools = await mcpClient.listTools();

    const toolContext = mcpTools.tools.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
      outputSchema: t.outputSchema,
    }));

    const systemInstrunctions = `You are Ai assistance with access to internal toolsvia MCP.Use the tools as neeeded to answer user queries. Do not mention tool usage unless asked `;

    //Hard response contract
    const responseContract = `You must always respond in valid JSON

        If no Tool is required :
        {
          "action": "final",
          "tool":null,
          "arguments":null,
          "output":"</Response>"
        }


        If a tool is required :
        {
          "action": "tool",
          "tool":<tool_name>,
          "arguments":{
            //tool-specific arguments here
          },
          "output": null
        }

        Never reply in Plain text
      `;

    //message state
    let messages: any = [
      { role: "developer", content: systemInstrunctions },
      { role: "developer", content: responseContract },
      {
        role: "developer",
        content: `<Available tools: ${JSON.stringify(toolContext, null, 2)}`,
      },
      { role: "user", content: prompt },
    ];

    //agent loop
    for (let step = 0; step < this.MAX_STEPS; step++) {
      let intent;
      try {
        //we use parse because we want a structured output
        const response = await this.Openai.responses.parse({
          model: this.modelName,
          input: messages,
          text: {
            //forcing llm to give us structed response
            format: zodTextFormat(ToolIntentSchema, "Intent"),
          },
        });

        if (!response.output_parsed) {
          throw new Error("Failed to parse response");
        }

        intent = response.output_parsed;
      } catch (error: any) {
        console.error("OpenAi parse failure:", error);
        throw new Error("Failed to generate response from OpenAI API");
      }

      //tool execution
      if (intent.action === "tool") {
        const result = await mcpClient.callTool({
          name: intent.tool!,
          arguments: intent.arguments!,
        });

        messages.push({
          role: "assistance",
          content: JSON.stringify(intent),
        });

        messages.push({
          role: "developer",
          content: `
           MCP tool "${intent.tool}" executed.

           Structured output:
           ${JSON.stringify(result.structuredContent, null, 2)}
          `,
        });

        continue;
      }

      if (intent.action === "final") {
        return intent.output!;
      }
    }

    throw new Error("Agent exceeded maximum reasoning steps");
  }
}

export const OPENAI = OpenaiService.getInstance();
