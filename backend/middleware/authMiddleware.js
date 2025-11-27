import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =============================
// VERIFY TOKEN MIDDLEWARE
// =============================
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// =============================
// OPTIONAL AUTH MIDDLEWARE (for guest support)
// =============================
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      // If token exists, verify it
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role;
    }
    // If no token, req.userId will be undefined (guest user)

    next();
  } catch (err) {
    // If token is invalid, treat as guest
    req.userId = undefined;
    next();
  }
};

// =============================
// VERIFY ADMIN MIDDLEWARE
// =============================
export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
