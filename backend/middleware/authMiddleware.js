import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isMongoReady } from "../config/db.js";
import { loadLocalDb } from "../utils/helpers.js";

export const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
      console.log("Token verified, decoded:", decoded);
      
      if (!isMongoReady()) {
        const db = await loadLocalDb();
        req.user = db.users.find(u => String(u.id) === String(decoded.userId));
        console.log("Local DB fallback user found:", req.user ? "YES" : "NO", "userId:", decoded.userId);
      } else {
        req.user = await User.findOne({ id: decoded.userId }).select("-password");
        console.log("MongoDB user found:", req.user ? "YES" : "NO");
      }
      
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.email.toLowerCase() === "admin@gmail.com") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};
