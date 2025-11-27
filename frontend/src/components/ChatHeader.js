import React from "react";
import "../components/styles/chatHeader.css";

export default function ChatHeader({ selectedModel }) {
  return (
    <header className="chat-header">
      <h2 className="chat-title">AI Chat Assistant</h2>
      <div className="model-indicator">
        <span>Model:</span> <strong>{selectedModel}</strong>
      </div>
    </header>
  );
}
