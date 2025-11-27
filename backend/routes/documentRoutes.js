import express from "express";
import {
  uploadDocument,
  getAllDocuments,
  getDocument,
  deleteDocument,
} from "../controllers/documentController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All routes require admin authentication
router.use(verifyToken);
router.use(verifyAdmin);

// Upload document
router.post("/upload", upload.single("file"), uploadDocument);

// Get all documents (without content)
router.get("/", getAllDocuments);

// Get single document (with content)
router.get("/:id", getDocument);

// Delete document
router.delete("/:id", deleteDocument);

export default router;
