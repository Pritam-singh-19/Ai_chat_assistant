// clean text (remove weird characters)
export const cleanText = (text) => {
  return text.replace(/\s+/g, " ").trim();
};

// estimate confidence (frontend simulation only)
export const randomConfidence = () => {
  return Math.floor(Math.random() * 40) + 60; // 60–100%
};

// format date/time
export const formatTime = () => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// validate file type
export const isValidFile = (file) => {
  const allowed = ["image/png", "image/jpeg", "application/pdf"];
  return allowed.includes(file.type);
};
