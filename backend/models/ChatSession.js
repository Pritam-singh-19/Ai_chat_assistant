import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modelUsed: {
      type: String,
      enum: ["gemini", "llama-3", "mistral"],
      required: true,
    },
    messageCount: {
      type: Number,
      default: 1,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    collection: "chat_sessions",
    timestamps: true 
  }
);

export default mongoose.model("ChatSession", chatSessionSchema);
