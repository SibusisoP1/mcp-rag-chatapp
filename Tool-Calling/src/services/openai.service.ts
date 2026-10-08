import { OpenAI } from "openai";
import { weatherService } from "./weather.service.ts";
import { customerService } from "./customer.service.ts";
import type {
  ResponseInput,
  Tool,
} from "openai/resources/responses/responses.js";

class OpenaiService {
  private static instance: OpenaiService;
  private readonly modelName: string;
  private readonly apiKey: string;
  private readonly Openai: OpenAI;

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

  async callLLM(
    contents: string | ResponseInput,
    tools: Tool[],
    instructions?: string,
  ): Promise<any> {
    try {
      const response = await this.Openai.responses.create({
        model: this.modelName,
        input: contents,
        tools,
        ...(instructions ? { instructions } : {}),
      });

      return response;
    } catch (error) {
      console.error("Error calling LLM from OpenAI API:", error);
      throw new Error("Failed to call LLM from OpenAI API");
    }
  }

  async generateResponseWithTools(prompt: string): Promise<string> {
    try {
      const getWeatherFn: Tool = {
        type: "function",
        name: "getWeather",
        description: "Get the current weather for a given location",
        strict: true,
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The location to get the weather for",
            },
          },
          required: ["location"],
          additionalProperties: false,
        },
      };

      const getCustomerFn: Tool = {
        type: "function",
        name: "get_all_Customer",
        description: "Get customer information by ID",
        strict: true,
        parameters: {
          type: "object",
          properties: {
            limit: {
              type: ["number", "null"],
              description: "The maximum number of customers to retrieve",
            },
          },
          required: ["limit"],
          additionalProperties: false,
        },
      };

      const tools = [getWeatherFn, getCustomerFn];

      //Ai response with function calling

      let input: ResponseInput = [
        {
          role: "user",
          content: prompt,
        },
      ];

      const response = await this.callLLM(input, tools);

      //handle function calls if any
      for (const item of response.output) {
        input.push(item);

        if (item.type !== "function_call") continue;

        const { name, arguments: rawArgs, call_id } = item;

        const args = rawArgs ? JSON.parse(rawArgs) : {};

        let result: any;

        switch (name) {
          case "getWeather":
            result = await weatherService.getWeatherData(args.location);
            break;
          case "get_all_Customer":
            result = await customerService.getLatestCustomers(args?.limit);
            break;
          default:
            throw new Error(`Unknown function call: ${name}`);
        }

        //send the result back to the model for further processing

        input.push({
          type: "function_call_output",
          call_id,
          output: JSON.stringify(result),
        });
      }

      //final response from the model after processing function calls
      const instructions = "Respond clealy using the tool output";
      const finalResponse = await this.callLLM(input, tools, instructions);

      return (
        finalResponse.output_text || "No response generated from OpenAI API"
      );
    } catch (error: any) {
      console.error("Error generating response from OpenAI API:", error);
      throw new Error("Failed to generate response from OpenAI API");
    }
  }
}

export const OPENAI = OpenaiService.getInstance();
