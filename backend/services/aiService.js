import axios from "axios";

export const getGeminiResponse = async (message, documentsContext = "") => {
  try {
    let systemPrompt = "You are a helpful AI assistant. Provide concise, clear, and accurate responses. Keep answers brief (2-3 paragraphs max) unless the user specifically asks for detailed information. Use simple language and structure your response with line breaks for better readability.";
    
    // Add documents context if available
    if (documentsContext) {
      systemPrompt += "\n\nUse the following company documents and FAQs to answer questions accurately:\n" + documentsContext;
    }
    
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: systemPrompt + "\n\nUser: " + message }] }],
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.log("Gemini API Error:", error.response.data);
    throw new Error("Failed to get response from Gemini");
  }
};



export const getPerplexityResponse = async (message, documentsContext = "") => {
  try {
    let systemPrompt = "You are a helpful AI assistant. Provide concise, clear, and accurate responses. Keep answers brief (2-3 paragraphs max) unless the user specifically asks for detailed information. Use simple language and structure your response with line breaks for better readability.";
    
    // Add documents context if available
    if (documentsContext) {
      systemPrompt += "\n\nUse the following company documents and FAQs to answer questions accurately:\n" + documentsContext;
    }
    
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar", // ✅ current valid model id
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 800,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Perplexity API Error:", error.response?.data || error.message);
    throw new Error("Failed to get response from Perplexity");
  }
};



export const getGroqResponse = async (message, documentsContext = "") => {
  try {
    let systemPrompt = "You are a helpful AI assistant. Provide concise, clear, and accurate responses. Keep answers brief (2-3 paragraphs max) unless the user specifically asks for detailed information. Use simple language and structure your response with line breaks for better readability.";
    
    // Add documents context if available
    if (documentsContext) {
      systemPrompt += "\n\nUse the following company documents and FAQs to answer questions accurately:\n" + documentsContext;
    }
    
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile", // ✅ valid for text chat
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);
    throw new Error("Failed to get response from Groq");
  }
}; 

export const getAIResponse = async (provider, message, documentsContext = "") => {
  provider = provider?.toLowerCase().trim();

  const validProviders = {
    gemini: getGeminiResponse,
    perplexity: getPerplexityResponse,
    groq: getGroqResponse,
  };

  if (!validProviders[provider]) {
    console.log("Invalid provider received:", provider);
    throw new Error("Invalid AI provider selected");
  }

  return await validProviders[provider](message, documentsContext);
};  
