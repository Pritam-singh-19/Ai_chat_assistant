import Document from "../models/Document.js";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Extract text from uploaded file
const extractTextFromFile = async (filePath, fileType) => {
  try {
    if (fileType === "txt") {
      return fs.readFileSync(filePath, "utf-8");
    } else if (fileType === "pdf") {
      // Use CommonJS require for pdf-parse
      const { PDFParse } = require("pdf-parse");
      const dataBuffer = fs.readFileSync(filePath);
      const pdfParser = new PDFParse({
        data: dataBuffer,
        verbosity: 0
      });
      const result = await pdfParser.getText();
      return result.text;
    } else if (fileType === "docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }
    throw new Error("Unsupported file type");
  } catch (error) {
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};

// Upload document
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, path: filePath } = req.file;
    const fileType = path.extname(originalname).toLowerCase().slice(1);

    // Extract text from file
    const content = await extractTextFromFile(filePath, fileType);

    if (!content || content.trim().length === 0) {
      fs.unlinkSync(filePath); // Delete file
      return res.status(400).json({ message: "No text found in the file" });
    }

    // Save to database
    const document = new Document({
      title: originalname,
      content: content.trim(),
      fileType: fileType,
      uploadedBy: req.userId,
    });

    await document.save();

    // Delete the uploaded file after extraction
    fs.unlinkSync(filePath);

    res.status(201).json({
      message: "Document uploaded successfully",
      document: {
        id: document._id,
        title: document.title,
        fileType: document.fileType,
        uploadedAt: document.uploadedAt,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    
    // Clean up file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: error.message || "Failed to upload document" });
  }
};

// Get all documents
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .select("-content") // Exclude content for list view
      .sort({ uploadedAt: -1 })
      .populate("uploadedBy", "username email");

    res.json({ documents });
  } catch (error) {
    console.error("Fetch documents error:", error);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

// Get single document with content
export const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ document });
  } catch (error) {
    console.error("Fetch document error:", error);
    res.status(500).json({ message: "Failed to fetch document" });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({ message: "Failed to delete document" });
  }
};

// Get all documents content (for AI context)
export const getAllDocumentsContent = async () => {
  try {
    const documents = await Document.find().select("title content");
    
    if (documents.length === 0) {
      return "";
    }

    // Combine all documents into one context string
    return documents
      .map((doc) => `\n--- ${doc.title} ---\n${doc.content}`)
      .join("\n\n");
  } catch (error) {
    console.error("Error fetching documents content:", error);
    return "";
  }
};
