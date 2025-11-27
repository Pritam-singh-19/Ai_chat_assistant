import { makeAutoObservable, runInAction } from "mobx";
import { randomConfidence } from "../utils/helpers";

class ChatStore {
  messages = [];
  confidence = null;
  selectedModel = "gpt-4";

  constructor() {
    makeAutoObservable(this);
  }

  setModel(model) {
    this.selectedModel = model;
  }

  addUserMessage(text) {
    this.messages.push({
      sender: "user",
      text,
      time: new Date(),
    });
  }

  addAIMessage(text) {
    this.messages.push({
      sender: "ai",
      text,
      time: new Date(),
    });
  }

  async sendMessage(text) {
    if (!text.trim()) return;

    this.addUserMessage(text);

    // Placeholder: replace later with backend API
    setTimeout(() => {
      runInAction(() => {
        this.addAIMessage("This is a sample AI response (API coming soon).");
        this.confidence = randomConfidence();
      });
    }, 600);
  }

  setConfidence(score) {
    this.confidence = score;
  }

  clearChat() {
    this.messages = [];
    this.confidence = null;
  }
}

const chatStore = new ChatStore();
export default chatStore;
