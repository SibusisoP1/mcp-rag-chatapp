import {
  FunctionCallingConfigMode,
  GoogleGenAI,
  Type,
  type ContentListUnion,
  type ToolListUnion,
} from "@google/genai";
import { weatherService } from "./weather.service.ts";
import { customerService } from "./customer.service.ts";

class geminiService {
  private static instance: geminiService;
  private readonly modelName: string;
  private readonly apiKey: string;
  private readonly ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL;

    if (!apiKey) {
      throw new Error("API key is required");
    }

    if (!modelName) {
      throw new Error("Model name is required");
    }

    this.modelName = modelName;
    this.apiKey = apiKey;

    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  static getInstance(): geminiService {
    if (!this.instance) {
      this.instance = new geminiService();
    }
    return this.instance;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.ai.interactions.create({
        model: this.modelName,
        input: prompt,
      });
      return response.output_text || "No response generated from Gemini API";
    } catch (error: any) {
      console.error("Error generating response from Gemini API:", error);
      throw new Error("Failed to generate response from Gemini API");
    }
  }

  async generateEmbeddings(
    data: string | string[],
    taskType = "RETRIEVAL_QUERY",
  ) {
    try {
      const response = await this.ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: data,
        config: { taskType: taskType },
      });

      const embeddings = response.embeddings?.map((e) => e.values) ?? [];
      return embeddings;
    } catch (error) {
      console.error("Error generating embedding from Gemini API:", error);
      throw new Error("Failed to generate embedding from Gemini API");
    }
  }

  async callLLM(
    contents: ContentListUnion,
    tools: ToolListUnion,
  ): Promise<any> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents,
        config: {
          tools: tools,
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.AUTO,
            },
          },
        },
      });

      return response;
    } catch (error) {
      console.error("Error calling LLM from Gemini API:", error);
      throw new Error("Failed to call LLM from Gemini API");
    }
  }

  async generateResponseWithTools(prompt: string): Promise<string> {
    try {
      const getWeatherFn = {
        name: "getWeather",
        description: "Get the current weather for a given location",
        parameters: {
          type: Type.OBJECT,
          properties: {
            location: {
              type: Type.STRING,
              description: "The location to get the weather for",
            },
          },
          required: ["location"],
        },
      };

      const getCustomerFn = {
        name: "get_all_Customer",
        description: "Get customer information by ID",
        parameters: {
          type: Type.OBJECT,
          properties: {
            limit: {
              type: Type.NUMBER,
              description: "The maximum number of customers to retrieve",
            },
          },
        },
      };

      const tools = [
        {
          functionDeclarations: [getWeatherFn, getCustomerFn],
        },
      ];

      //Ai response with function calling
      const response = await this.callLLM(prompt, tools);

      if (response.functionCalls && response.functionCalls.length > 0) {
        const fnCall = response.functionCalls[0];

        if (!fnCall) {
          return response.text || "No response generated from Gemini API";
        }

        const { name, args } = fnCall;

        let result: any;

        switch (name) {
          case "getWeather":
            const location = (args as { location: string })?.location;

            if (typeof location !== "string") {
              throw new Error("Invalid location provided");
            }

            result = await weatherService.getWeatherData(location);
            break;

          case "get_all_Customer":
            const limit = (args as { limit?: number })?.limit;

            if (limit !== undefined && typeof limit !== "number") {
              throw new Error("Invalid limit provided");
            }

            result = await customerService.getLatestCustomers(limit);
            break;
          default:
            throw new Error(`Unknown function call: ${name}`);
        }

        //send the result back to the model for further processing
        const followUpResponse = await this.callLLM(
          [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
            response.candidates[0].content,
            {
              role: "user",
              parts: [
                {
                  functionResponse: {
                    name,
                    response: { result },
                  },
                },
              ],
            },
          ],
          tools,
        );

        return followUpResponse.text || "No response generated from Gemini API";
      }
      // If no function call was made, return the original response
      return response.text || "No response generated from Gemini API";
    } catch (error: any) {
      console.error("Error generating response from Gemini API:", error);
      throw new Error("Failed to generate response from Gemini API");
    }
  }
}

export const GEMINI = geminiService.getInstance();
