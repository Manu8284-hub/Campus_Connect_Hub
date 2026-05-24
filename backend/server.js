import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { corsMiddleware } from "./middleware/cors.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

// Connect to Database
await connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.use("/uploads", express.static(uploadsDir));

// Attach io to app
app.set("io", io);

// Socket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// API Routes
app.use("/auth", authRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Campus Connect MongoDB Backend is running (MVC Architecture + Socket.io)",
    routes: [
      "POST /auth/register",
      "POST /auth/login",
      "POST /auth/logout",
      "GET /auth/verify",
      "GET /auth/logins",
      "GET /api/clubs",
      "GET /api/events",
    ],
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

