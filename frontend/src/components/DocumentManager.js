import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DocumentManager.css";

export default function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://ai-chat-assistant-j6r6.onrender.com/api/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("Failed to fetch documents");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert("Only PDF, TXT, and DOCX files are allowed");
        e.target.value = "";
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", selectedFile);

      await axios.post("https://ai-chat-assistant-j6r6.onrender.com/api/documents/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Document uploaded successfully!");
      setSelectedFile(null);
      document.getElementById("file-input").value = "";
      fetchDocuments();
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://ai-chat-assistant-j6r6.onrender.com/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Document deleted successfully!");
      fetchDocuments();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete document");
    }
  };

  return (
    <div className="document-manager">
      <div className="upload-section">
        <h2>📤 Upload Company Documents</h2>
        <p className="upload-description">
          Upload PDFs, text files, or DOCX documents containing FAQs, policies, or company information. 
          The AI will use these documents to answer user questions accurately.
        </p>
        
        <div className="upload-container">
          <input
            type="file"
            id="file-input"
            accept=".pdf,.txt,.docx"
            onChange={handleFileSelect}
            className="file-input"
          />
          
          {selectedFile && (
            <div className="selected-file">
              <span>📄 {selectedFile.name}</span>
              <button onClick={() => setSelectedFile(null)} className="clear-btn">✕</button>
            </div>
          )}
          
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="upload-btn"
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      </div>

      <div className="documents-list">
        <h2>📚 Uploaded Documents ({documents.length})</h2>
        
        {documents.length === 0 ? (
          <p className="no-documents">No documents uploaded yet. Upload your first document above.</p>
        ) : (
          <div className="documents-grid">
            {documents.map((doc) => (
              <div key={doc._id} className="document-card">
                <div className="document-icon">
                  {doc.fileType === "pdf" ? "📕" : doc.fileType === "docx" ? "📘" : "📄"}
                </div>
                <div className="document-info">
                  <h3>{doc.title}</h3>
                  <p className="document-meta">
                    <span>Type: {doc.fileType.toUpperCase()}</span>
                    <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="delete-btn"
                  title="Delete document"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
