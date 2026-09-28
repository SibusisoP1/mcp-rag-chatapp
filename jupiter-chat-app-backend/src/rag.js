import fs from "node:fs";
import path from "node:path";
import cosineSimilarity from "compute-cosine-similarity";

class ragProvider {
  fetchDocumentData(fileName) {
    const filePath = path.join(process.cwd(), "data", fileName);
    const documentData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return documentData;
  }

  prepareRagData(query) {
    //process.cwd points to the direction in directory where the node command was executed. In this case, it points to the root of the project.
    // const filePath = path.join(process.cwd(), "data", "knowledgeBase.json");

    // const kbData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const kbData = this.fetchDocumentData("knowledgeBase.json");

    const content = kbData
      .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
      .join("\n\n");

    const prompt = `You are a Ai assistant that helps answer questions based on the following knowledge base:\n\n${content}\n\nAnswer the following user question:\n\nQuestion: ${query}\n\nAnswer:`;
    return prompt;
  }

  prepareRagPrompt(query, queryVector, faqVectors) {
    const ranked = faqVectors
      .map((item) => ({
        ...item,
        score: cosineSimilarity(queryVector, item.vector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2); // Get top 2 relevant FAQs

    const content = ranked.map((item) => item.answer).join("\n");

    const prompt = `You are a Ai assistant that helps answer questions based on the following knowledge base:\n\n${content}\n\nIf the answer isnt there say "I don't know." .Answer the following user question:\n\nQuestion: ${query}\n\nAnswer:`;
    return prompt;
  }
}

export default ragProvider;
