import express from "express";
import { prisma } from "../index.js";
import protectRoute from "../middlewares/auth.middleware.js";
import crypto from "crypto";

const router = express.Router();

// Get comments using Prisma Client
router.get("/:bookId", protectRoute, async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { bookId: req.params.bookId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true
          }
        }
      }
    });

    const formattedComments = comments.map(c => ({
      id: c.id,
      _id: c.id,
      text: c.text,
      userId: c.userId,
      bookId: c.bookId,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      user: {
        id: c.user.id,
        _id: c.user.id,
        username: c.user.username,
        profileImage: c.user.profileImage
      }
    }));

    res.json(formattedComments);
  } catch (error) {
    console.log("Error fetching comments", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add comment using Prisma Client
router.post("/:bookId", protectRoute, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const commentId = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = createdAt;

    const newComment = await prisma.comment.create({
      data: {
        id: commentId,
        text,
        userId: req.user.id,
        bookId: req.params.bookId,
        createdAt,
        updatedAt
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true
          }
        }
      }
    });

    res.status(201).json({
      id: newComment.id,
      _id: newComment.id,
      text: newComment.text,
      userId: newComment.userId,
      bookId: newComment.bookId,
      createdAt: newComment.createdAt,
      updatedAt: newComment.updatedAt,
      user: {
        id: newComment.user.id,
        _id: newComment.user.id,
        username: newComment.user.username,
        profileImage: newComment.user.profileImage
      }
    });
  } catch (error) {
    console.log("Error adding comment", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
