import User from "../models/User.js";
import ChatSession from "../models/ChatSession.js";

// =============================
// GET ALL USERS
// =============================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // exclude password
      .sort({ createdAt: -1 });

    // Count chat sessions for each user
    const usersWithChats = await Promise.all(
      users.map(async (user) => {
        const chatCount = await ChatSession.countDocuments({ userId: user._id });
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          chats: chatCount,
          createdAt: user.createdAt,
        };
      })
    );

    res.json({ users: usersWithChats });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

// =============================
// DELETE USER
// =============================
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Don't allow deleting yourself (the admin)
    if (userId === req.userId) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Also delete all chat sessions for this user
    await ChatSession.deleteMany({ userId });

    res.json({ message: "User deleted successfully", deletedUser });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

// =============================
// GET ANALYTICS/INSIGHTS
// =============================
export const getAnalytics = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Active users (users who have at least 1 chat session)
    const activeUserIds = await ChatSession.distinct("userId");
    const activeUsers = activeUserIds.length;

    // Total chat sessions
    const totalChats = await ChatSession.countDocuments();

    // Model usage statistics
    const modelStats = await ChatSession.aggregate([
      {
        $group: {
          _id: "$modelUsed",
          count: { $sum: 1 },
        },
      },
    ]);

    // Calculate percentages
    const modelUsage = modelStats.map((stat) => ({
      model: stat._id,
      count: stat.count,
      percentage: totalChats > 0 ? ((stat.count / totalChats) * 100).toFixed(2) : 0,
    }));

    // Fill in missing models with 0%
    const allModels = ["gemini", "llama-3", "mistral"];
    const completeModelUsage = allModels.map((model) => {
      const found = modelUsage.find((m) => m.model === model);
      return found || { model, count: 0, percentage: 0 };
    });

    res.json({
      totalUsers,
      activeUsers,
      totalChats,
      modelUsage: completeModelUsage,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching analytics", error: err.message });
  }
};

// =============================
// CLEAR ALL CHATS (optional)
// =============================
export const clearAllChats = async (req, res) => {
  try {
    await ChatSession.deleteMany({});
    res.json({ message: "All chat sessions cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing chats", error: err.message });
  }
};
