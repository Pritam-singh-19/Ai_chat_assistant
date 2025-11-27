import React from "react";
import "../components/styles/fileUploadButton.css";

export default function FileUploadButton({ onFileSelect }) {
  return (
    <div className="file-upload-wrapper">
      <input
        type="file"
        id="file-input"
        accept="image/*,.pdf"
        hidden
        onChange={onFileSelect}
      />
      <label htmlFor="file-input" className="file-btn" title="Upload image or PDF">
        📎
      </label>
    </div>
  );
}
