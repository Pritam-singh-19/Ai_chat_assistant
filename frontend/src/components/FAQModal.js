import React, { useState } from "react";
import "./styles/faqModal.css";

const faqData = [
  {
    question: "How do I reset my password?",
    answer: "Go to the login page and click on 'Forgot Password'. Enter your registered email. You will receive a reset link. Click the link and set a new password."
  },
  {
    question: "How can I contact the admin or support team?",
    answer: "You can contact the admin directly:\n📞 WhatsApp: 8582957781\n📧 Email: pritamsing1906@gmail.com\n🔗 LinkedIn: https://www.linkedin.com/in/pritam-singh-40044428a-\n🐙 GitHub: https://github.com/Pritam-singh-19\n📸 Instagram: https://www.instagram.com/pritamsingh1903"
  },
  {
    question: "How do I upload documents for support?",
    answer: "Go to the Admin Panel > Upload Section. There you can upload PDF, DOCX, or images. The system will automatically extract text and use it for answering user queries."
  },
  {
    question: "What type of files are supported?",
    answer: "Currently the system supports: PDF, DOC/DOCX, PNG, JPG, and JPEG. All uploaded files are scanned and converted into text for the AI assistant."
  },
  {
    question: "Is my uploaded data safe?",
    answer: "Yes, all uploaded documents and chat data are stored securely in MongoDB. Only authorized admins can view or modify uploaded files."
  },
  {
    question: "How does the AI give answers?",
    answer: "The AI assistant uses your uploaded company documents, FAQs, and chat history to give accurate, context-aware answers by running them through a Large Language Model (LLM)."
  },
  {
    question: "Can I delete uploaded documents?",
    answer: "Yes, admins can delete documents from the Admin Panel using the 'Delete' button next to each uploaded file."
  },
  {
    question: "What happens after I upload a new document?",
    answer: "The system automatically extracts the text, saves it in the database, and updates the knowledge base so the AI can use it immediately for answering questions."
  },
  {
    question: "Why am I not receiving a password reset email?",
    answer: "Check your spam folder. If not found, ensure that your email is registered. You can also contact support at pritamsing1906@gmail.com or WhatsApp 8582957781."
  },
  {
    question: "Can I clear my chat history?",
    answer: "Yes, users can clear chat history using the 'Clear Chat' button on the chat screen. Admins can also remove user chat records from the dashboard."
  },
  {
    question: "Is the chat available 24/7?",
    answer: "Yes, the AI assistant works 24/7. For urgent issues, contact the admin directly via WhatsApp at 8582957781."
  }
];

export default function FAQModal({ isOpen, onClose }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!isOpen) return null;

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-modal-overlay" onClick={onClose}>
      <div className="faq-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="faq-header">
          <h2>❓ Frequently Asked Questions</h2>
          <button className="faq-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="faq-list">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item">
              <div 
                className={`faq-question ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
              </div>
              
              {activeIndex === index && (
                <div className="faq-answer">
                  {faq.answer.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
