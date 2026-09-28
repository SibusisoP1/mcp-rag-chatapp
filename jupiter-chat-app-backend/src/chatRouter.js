import express from "express";
import geminiProvider from "./geminiProvider.js";
import ragProvider from "./rag.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const message = req.body?.message || req.body?.content;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  console.log(`Received message : ${message}`);

  try {
    const gemini = new geminiProvider(
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_MODEL ||
        process.env.GEMINI_MODEL_NAME ||
        "gemini-3.8-flash",
    );
    //this is for ai chatbot without Rag
    // const response = await gemini.generateResponse(message);

    //this is for ai chatbot with Rag
    const rag = new ragProvider();
    // const prompt = rag.prepareRagData(message);

    //this is for ai chatbot with Rag and embedding
    //this is for query embedding
    const queryEmbedding = await gemini.generateEmbeddings(message);
    const queryVector = queryEmbedding[0]; // Assuming the first embedding is the query vector

    //this is for faq embedding
    const faqData = rag.fetchDocumentData("faq.json");
    const faqEmbeddings = await gemini.generateEmbeddings(
      faqData.map((item) => item.answer),
      "RETRIEVAL_DOCUMENT",
    );

    const faqVectors = faqData.map((faq, index) => ({
      ...faq,
      vector: faqEmbeddings[index],
    }));

    const prompt = rag.prepareRagPrompt(message, queryVector, faqVectors);

    console.log(`Prompt for Gemini API: ${prompt}`);

    const response = await gemini.generateResponse(prompt);
    console.log(`Generated respsonse: ${response}`);

    res.json({ reply: response });
  } catch (error) {
    console.error("Error generating response from Gemini API:", error);
    res
      .status(500)
      .json({ error: "Failed to generate response from Gemini API" });
  }
});

export default router;
