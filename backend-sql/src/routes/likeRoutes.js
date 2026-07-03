import express from "express";
import { prisma } from "../index.js";
import protectRoute from "../middlewares/auth.middleware.js";
import crypto from "crypto";

const router = express.Router();

// Helper to get book by ID using Prisma Client
const getBookByIdRaw = async (bookId) => {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          profileImage: true
        }
      },
      likes: {
        select: {
          userId: true
        }
      }
    }
  });
  if (!book) return null;

  return {
    id: book.id,
    _id: book.id,
    title: book.title,
    caption: book.caption,
    details: book.details,
    rating: book.rating,
    image: book.image,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
    userId: book.userId,
    user: {
      id: book.user.id,
      _id: book.user.id,
      username: book.user.username,
      profileImage: book.user.profileImage
    },
    likes: book.likes.map(row => row.userId)
  };
};

// Toggle like using Prisma Client
router.put("/:bookId", protectRoute, async (req, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: req.params.bookId }
    });
    if (!book) return res.status(404).json({ message: "Book not found" });

    const userId = req.user.id;
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId: req.params.bookId
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      });
    } else {
      // Like
      const likeId = crypto.randomUUID();
      const createdAt = new Date();
      await prisma.like.create({
        data: {
          id: likeId,
          userId,
          bookId: req.params.bookId,
          createdAt
        }
      });
    }

    const updatedBook = await getBookByIdRaw(req.params.bookId);
    res.json(updatedBook);
  } catch (error) {
    console.log("Error liking book", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
