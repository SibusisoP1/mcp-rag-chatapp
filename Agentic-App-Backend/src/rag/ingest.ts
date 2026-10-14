import fs from "node:fs";
import { VectorStore } from "./Vector-Store/vector.store.ts";
import path from "node:path";
import { GEMINI } from "../services/gemini.service.ts";
import { randomUUID } from "node:crypto";

const CHUNK_SIZE = Number(process.env.CHUNK_SIZE) || 800;
const CHUNK_OVERLAP = Number(process.env.RAG_CHUNK_OVERLAP) || 100;

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let i = 0;

  while (i < text.length) {
    const end = Math.min(text.length, i + CHUNK_SIZE);
    chunks.push(text.slice(i, end));

    i += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
}

export async function ingestFolder(folderPath: string) {
  const store = VectorStore.get();

  await store?.init();

  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    if (!file.endsWith(".md") && !file.endsWith(".txt")) {
      continue;
    }

    const filepath = path.join(folderPath, file);
    const rawData = fs.readFileSync(filepath, "utf-8");

    //conver string to chunk
    const chunks = chunkText(rawData);

    //fetch embedding values for each chunk
    const embeddings = await GEMINI.generateEmbeddings(chunks);

    for (let i = 0; i < chunks.length; i++) {
      await store?.upsert({
        id: randomUUID(),
        docId: file,
        chunkIndex: i,
        text: chunks[i]!,
        embedding: embeddings[i]!,
        metadata: { source: filepath },
      });
    }

    console.log("ingested :", file);
  }
}

if (import.meta.url.includes("ingest")) {
  const folder = process.argv[2];

  if (!folder) {
    console.log("useage: node src/rag/ingest.ts src/data/rag_docs");
    process.exit(1);
  }

  ingestFolder(folder);
}
