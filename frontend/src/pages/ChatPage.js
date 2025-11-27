import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import ConfidenceMeter from "../components/ConfidenceMeter";
import ModelSelector from "../components/ModelSelector";
import TypingIndicator from "../components/TypingIndicator";
import FAQModal from "../components/FAQModal";

import "./Styles/ChatPage.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState("gemini");
  const [confidence, setConfidence] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  useEffect(() => {
    // Try to get username from different storage keys
    const storedUsername = localStorage.getItem("username");
    console.log("Stored username:", storedUsername);
    
    if (storedUsername && storedUsername !== "undefined" && storedUsername !== "null") {
      setUsername(storedUsername);
    } else {
      // Fallback: try to get from user object
      const userString = localStorage.getItem("user");
      console.log("User string:", userString);
      if (userString && userString !== "undefined") {
        try {
          const userData = JSON.parse(userString);
          console.log("Parsed user data:", userData);
          if (userData && userData.username) {
            setUsername(userData.username);
          }
        } catch (err) {
          console.error("Error parsing user data:", err);
        }
      }
    }
    
    // If no username found, user is a guest
    if (!username) {
      setUsername("Guest");
    }
  }, [username]);

  const handleSend = async (text) => {
    if (!text.trim() || loading) return;

    const token = localStorage.getItem("token");

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setLoading(true);
    setConfidence(null);

    try {
      // Send message to backend (works for both guest and authenticated users)
      const config = token ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } : {};

      const response = await axios.post(
        "http://localhost:5000/api/chat/message",
        {
          message: text,
          model: selectedModel,
        },
        config
      );

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: response.data.aiResponse },
      ]);

      // Set confidence score
      setConfidence(response.data.confidence);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Sorry, I couldn't process your message. Please try again.";
      
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: errorMsg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      window.location.href = '/';
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const isGuest = !localStorage.getItem('token');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      if (window.confirm('Document upload requires login. Would you like to login or register now?')) {
        window.location.href = '/login';
      }
      e.target.value = ''; // Reset file input
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    
    if (!isImage && !isPDF) {
      alert('Please upload an image file (jpg, png, etc.) or PDF file');
      return;
    }

    // Show file upload message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `📄 Processing ${isPDF ? 'PDF' : 'image'}: ${file.name}...` },
    ]);

    setLoading(true);

    try {
      let extractedText = '';

      if (isPDF) {
        // Extract text from PDF
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }
        
        extractedText = fullText.trim();
        
      } else {
        // Extract text from image using Tesseract
        const Tesseract = await import('tesseract.js');
        
        const { data } = await Tesseract.recognize(file, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          },
        });

        extractedText = data.text.trim();
      }

      if (!extractedText) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: `No text found in the ${isPDF ? 'PDF' : 'image'}. Please upload a file with visible text.` },
        ]);
        setLoading(false);
        return;
      }

      // Limit extracted text display to first 500 characters
      const displayText = extractedText.length > 500 
        ? extractedText.substring(0, 500) + '...' 
        : extractedText;

      // Update message with extracted text
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "user", text: `📄 ${file.name}\n\nExtracted text:\n${displayText}` },
      ]);

      // Send extracted text to AI
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "http://localhost:5000/api/chat/message",
        {
          message: `Please analyze this text extracted from a ${isPDF ? 'PDF document' : 'an image'}:\n\n${extractedText}`,
          model: selectedModel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: response.data.aiResponse },
      ]);

      setConfidence(response.data.confidence);

    } catch (error) {
      console.error("File processing error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Failed to process the file. Please try again." },
      ]);
    } finally {
      setLoading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="chatpage-wrapper">
      <div className="bg-glow glow1"></div>
      <div className="bg-glow glow2"></div>

      <div className="chat-container">

        <div className="chat-header-row">
          <h2 className="welcome-msg">
            👋 Welcome, <span>{username || "Guest"}</span>
          </h2>
          <div className="header-buttons">
            <button className="faq-btn-chat" onClick={() => setShowFAQ(true)}>
              ❓ FAQ
            </button>
            {isGuest ? (
              <button className="login-btn-chat" onClick={handleLogin}>
                🔐 Login
              </button>
            ) : (
              <button className="logout-btn-chat" onClick={handleLogout}>
                🚪 Logout
              </button>
            )}
          </div>
        </div>

        <FAQModal isOpen={showFAQ} onClose={() => setShowFAQ(false)} />

        <ChatHeader selectedModel={selectedModel} />

        <div className="model-area">
          <ModelSelector selectedModel={selectedModel} onChange={setSelectedModel} />
        </div>

        <div className="messages-area">
          {messages.map((msg, index) => (
            <ChatMessage key={index} sender={msg.sender} text={msg.text} />
          ))}
          {loading && <TypingIndicator />}
          {confidence !== null && <ConfidenceMeter score={confidence} />}
        </div>

        <ChatInput
          onSend={handleSend}
          onFileSelect={(e) => handleFileSelect(e)}
        />
      </div>
    </div>
  );
}
