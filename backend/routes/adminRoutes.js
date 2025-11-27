import express from "express";
import {
  getAllUsers,
  deleteUser,
  getAnalytics,
  clearAllChats,
} from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require admin authentication
router.get("/users", verifyAdmin, getAllUsers);
router.delete("/users/:userId", verifyAdmin, deleteUser);
router.get("/analytics", verifyAdmin, getAnalytics);
router.delete("/clear-chats", verifyAdmin, clearAllChats);

export default router;
