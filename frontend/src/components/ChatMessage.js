import React from "react";
import "../components/styles/chatMessage.css";

export default function ChatMessage({ sender, text }) {
  const formatText = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`chat-message ${sender === "user" ? "user" : "ai"}`}>
      <p>{formatText(text)}</p>
    </div>
  );
}
