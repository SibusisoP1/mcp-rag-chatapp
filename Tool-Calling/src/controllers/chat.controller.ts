import type { NextFunction, Request, Response } from "express";
import { GEMINI } from "../services/gemini.service.ts";
import { OPENAI } from "../services/openai.service.ts";

class chatController {
  static generateResponse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      // const response = await GEMINI.generateResponse(message);
      // const response = await GEMINI.generateResponseWithTools(message);
      const response = await OPENAI.generateResponseWithTools(message);
      res.json({ reply: response });
    } catch (error) {
      console.error("Error in /chat route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default chatController;
