import express from "express";
import { sendMessage } from "../controllers/chatController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send message to AI (works for both guest and authenticated users)
router.post("/message", optionalAuth, sendMessage);

export default router;
