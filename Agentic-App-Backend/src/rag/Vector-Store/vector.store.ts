import { VectorStoreChroma } from "./dbs/chroma.db.ts";
import { VectorStorePg } from "./dbs/pgvector.db.ts";

export class VectorStore {
  static get() {
    const backend = process.env.VECTOR_DB;

    if (backend === "chroma") return VectorStoreChroma;
    if (backend === "pgvector") return VectorStorePg;

    throw new Error("invalid VECTOR_DB. use pgvector or chroma");
  }
}
