import React, { useState } from "react";
import FileUploadButton from "./FileUploadButton";
import "../components/styles/chatInput.css";

export default function ChatInput({ onSend, onFileSelect }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <FileUploadButton onFileSelect={onFileSelect} />

      <input
        className="chat-input"
        placeholder="Type your message…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />

      <button
        className="send-btn"
        onClick={handleSend}
      >
        ➤
      </button>
    </div>
  );
}
