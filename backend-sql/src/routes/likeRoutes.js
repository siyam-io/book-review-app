import express from "express";
import { prisma } from "../index.js";
import protectRoute from "../middlewares/auth.middleware.js";
import crypto from "crypto";

const router = express.Router();

// Helper to get book by ID using raw SQL (redefined here for response)
const getBookByIdRaw = async (bookId) => {
  const bookRows = await prisma.$queryRawUnsafe(
    `SELECT b.*, u.id as user_id, u.username as user_username, u.profileImage as user_profileImage
     FROM "Book" b
     JOIN "User" u ON b.userId = u.id
     WHERE b.id = ?`,
    bookId
  );
  if (!bookRows || bookRows.length === 0) return null;
  const book = bookRows[0];

  const likeRows = await prisma.$queryRawUnsafe(
    `SELECT userId FROM "Like" WHERE bookId = ?`,
    bookId
  );

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
      id: book.user_id,
      _id: book.user_id,
      username: book.user_username,
      profileImage: book.user_profileImage
    },
    likes: likeRows.map(row => row.userId)
  };
};

// Toggle like
router.put("/:bookId", protectRoute, async (req, res) => {
  try {
    const bookRows = await prisma.$queryRawUnsafe(
      `SELECT * FROM "Book" WHERE id = ?`,
      req.params.bookId
    );
    const book = bookRows[0];
    if (!book) return res.status(404).json({ message: "Book not found" });

    const userId = req.user.id;
    const existingLikes = await prisma.$queryRawUnsafe(
      `SELECT id FROM "Like" WHERE userId = ? AND bookId = ?`,
      userId, req.params.bookId
    );

    if (existingLikes.length > 0) {
      // Unlike
      await prisma.$executeRawUnsafe(
        `DELETE FROM "Like" WHERE id = ?`,
        existingLikes[0].id
      );
    } else {
      // Like
      const likeId = crypto.randomUUID();
      const createdAt = new Date();
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Like" (id, userId, bookId, createdAt) VALUES (?, ?, ?, ?)`,
        likeId, userId, req.params.bookId, createdAt
      );
    }

    const updatedBook = await getBookByIdRaw(req.params.bookId);
    res.json(updatedBook);
  } catch (error) {
    console.log("Error liking book", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
