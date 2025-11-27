import { getAIResponse } from "../services/aiService.js";
import ChatSession from "../models/ChatSession.js";
import { getAllDocumentsContent } from "./documentController.js";

// =============================
// SEND MESSAGE TO AI
// =============================
export const sendMessage = async (req, res) => {
  try {
    const { message, model } = req.body;
    const userId = req.userId; // from auth middleware (undefined for guests)
    const isGuest = !userId;

    if (!message || !model) {
      return res.status(400).json({ message: "Message and model are required" });
    }

    console.log("Provider received:", model);
    console.log(`${isGuest ? 'Guest' : `User ${userId}`} sent message to ${model}:`, message);

    // Get all uploaded documents content for context
    const documentsContext = await getAllDocumentsContent();

    // Get AI response with documents context
    const aiResponse = await getAIResponse(model, message, documentsContext);

    // Map model names for database storage
    const modelMap = {
      gemini: "gemini",
      "llama-3": "llama-3",
      perplexity: "llama-3",
      groq: "llama-3",
      mistral: "mistral",
    };

    const dbModelName = modelMap[model.toLowerCase()] || "gemini";

    // Save chat session to database for analytics (only for authenticated users)
    if (userId) {
      const chatSession = new ChatSession({
        userId,
        modelUsed: dbModelName,
        messageCount: 1,
      });

      await chatSession.save();
    }

    // Return AI response
    res.json({
      success: true,
      userMessage: message,
      aiResponse,
      model,
      confidence: Math.floor(Math.random() * 15) + 85, // Random confidence 85-100%
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process message",
    });
  }
};
