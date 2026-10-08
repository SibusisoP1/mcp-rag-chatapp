import express from "express";
import chatController from "../controllers/chat.controller.ts";

const router = express.Router();

router.post("/chat", chatController.generateResponse);

export default router;
