import React from "react";
import "../components/styles/modelSelector.css";

export default function ModelSelector({ selectedModel, onChange }) {
  return (
    <select
      className="model-selector"
      value={selectedModel}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="gemini">🤖 Gemini</option>
      <option value="perplexity">🔍 Perplexity (LLaMA 3)</option>
      <option value="groq">⚡ Groq (LLaMA 3)</option>
    </select>
  );
}
