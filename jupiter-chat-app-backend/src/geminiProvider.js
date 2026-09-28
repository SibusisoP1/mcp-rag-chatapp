import { GoogleGenAI } from "@google/genai";

class geminiProvider {
  constructor(apiKey, modelName) {
    this.modelName = modelName;
    this.apiKey = apiKey;

    if (!this.apiKey) {
      throw new Error("API key is required for GeminiProvider");
    }

    if (!this.modelName) {
      throw new Error("Model name is required for GeminiProvider");
    }

    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async generateResponse(prompt) {
    try {
      const response = await this.ai.interactions.create({
        model: this.modelName,
        input: prompt,
      });
      return response.output_text || "No response generated from Gemini API";
    } catch (error) {
      console.error("Error generating response from Gemini API:", error);
      throw new Error("Failed to generate response from Gemini API");
    }
  }

  async generateEmbeddings(data, taskType = "RETRIEVAL_QUERY") {
    try {
      const response = await this.ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: data,
        config: { taskType: taskType },
      });

      const embeddings = response.embeddings.map((e) => e.values);
      return embeddings;
    } catch (error) {
      console.error("Error generating embedding from Gemini API:", error);
      throw new Error("Failed to generate embedding from Gemini API");
    }
  }
}

export default geminiProvider;
