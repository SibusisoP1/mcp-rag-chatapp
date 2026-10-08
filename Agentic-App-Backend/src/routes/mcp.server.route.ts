import Express from "express";
import { McpServerTransportController } from "../controllers/mcp.server.transport.controller.ts";

const router = Express.Router();

router.post("/", McpServerTransportController.handleRequest);
router.get("/", McpServerTransportController.handleGetRequest);
router.delete("/", McpServerTransportController.handleDeleteRequest);

export default router;
