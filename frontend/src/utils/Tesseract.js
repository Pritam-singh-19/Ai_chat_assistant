import Tesseract from "tesseract.js";

export async function extractTextFromImage(file) {
  try {
    const { data } = await Tesseract.recognize(file, "eng", {
      logger: (m) => console.log(m),
    });

    return data.text;
  } catch (error) {
    console.error("OCR Error:", error);
    return "Failed to extract text from file.";
  }
}
