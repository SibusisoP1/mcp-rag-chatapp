import { GEMINI } from "../services/gemini.service.ts";
import { VectorStore } from "./Vector-Store/vector.store.ts";

interface ragChunk {
  id: string;
  text: string;
  metadata: any;
  score: number | null;
}

export class RagEngine {
  //user prompt
  static async buildPrompt(query: string, topK: number = 4) {
    try {
      const store = VectorStore.get();
      await store.init();
      console.log("RAG:Vector store initialized");

      console.log("RAG: generating embeddings");
      const [queryEmbeddings] = await GEMINI.generateEmbeddings([query]);

      if (!queryEmbeddings) throw new Error("failed to create embeddings");

      console.log("RAG:embedding generated");

      if (queryEmbeddings.length !== Number(process.env.EMBEDDING_DIMS)) {
        throw new Error(`
            Embedding dimension mismatch . Expected ${process.env.EMBEDDING_DIMS}, got ${queryEmbeddings.length}.

            Check EMBEDDING_DIMS in env and your gemini ebedding model
            
            `);
      }

      console.log("RAG:searching vector Db");

      const result = await store.search(queryEmbeddings, topK);

      if (!result) {
        return {
          prompt: `no matchig documents found for query:${query}`,
          sources: [],
        };
      }

      const context = result
        .map((r: ragChunk, i: number) => {
          `SOURCE ${i + 1} :\n ${r.text}\nMETA: ${JSON.stringify(r.metadata)}`;
        })
        .join("\n\n");

      const prompt = `You are an assistant that answers questions only using the information
      in context.
      
      if the answer is not present , reply: "I dont have enough information.
      
      CONTEXT:
      ${context}
      
      QUESTION:
      ${query}
      
      ANSWER:`;

      return { prompt, sources: result };
    } catch (error) {
      console.error("RAG PIPELINE ERROR:", error);
      throw error;
    }
  }
}
