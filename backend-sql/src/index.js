import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Prisma
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json()); // to parse req.body
app.use(cookieParser()); // to parse cookies

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, async () => {
    console.log(`SQL Server running on ${PORT}`);
    try {
      await prisma.$connect();
      console.log("Database is connected via Prisma");
    } catch (error) {
      console.error("Database connection failed:", error);
    }
  });
}

export default app;
