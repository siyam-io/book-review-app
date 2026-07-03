import express from "express";
import cloudinary from "../lib/cloudinary.js";
import { prisma } from "../index.js";
import protectRoute from "../middlewares/auth.middleware.js";
import multer from "multer";
import crypto from "crypto";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
    likes: book.likes.map(like => like.userId)
  };
};

// Helper to format book for frontend
const formatBook = (book) => {
  return {
    ...book,
    _id: book.id,
    user: book.user ? { ...book.user, _id: book.user.id } : undefined,
    likes: book.likes ? book.likes.map(u => u.id) : [],
  };
};

router.post("/", protectRoute, upload.single("image"), async (req, res) => {
  try {
    const { title, caption, rating, details } = req.body;
    const file = req.file;

    if (!file || !title || !caption || !rating || !details) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = createdAt;

    if (process.env.CLOUDINARY_CLOUD_NAME === "dummy" || !process.env.CLOUDINARY_CLOUD_NAME) {
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      
      await prisma.book.create({
        data: {
          id,
          title,
          caption,
          details,
          rating: Number(rating),
          image: base64Image,
          userId: req.user.id,
          createdAt,
          updatedAt
        }
      });

      const dbBook = await getBookByIdRaw(id);
      return res.status(201).json(dbBook);
    }

    // upload file to cloudinary
    const uploadResponse = await cloudinary.uploader.upload_stream(
      { folder: "books" },
      async (error, result) => {
        if (error) return res.status(500).json({ message: error.message });

        await prisma.book.create({
          data: {
            id,
            title,
            caption,
            details,
            rating: Number(rating),
            image: result.secure_url,
            userId: req.user.id,
            createdAt,
            updatedAt
          }
        });

        const dbBook = await getBookByIdRaw(id);
        res.status(201).json(dbBook);
      }
    );
    uploadResponse.end(file.buffer);
  } catch (error) {
    console.log("Error creating book", error);
    res.status(500).json({ message: error.message });
  }
});

// pagination => infinite loading
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
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

    const totalBooks = await prisma.book.count();

    const booksWithLikes = books.map(book => ({
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
      likes: book.likes.map(like => like.userId)
    }));

    res.send({
      books: booksWithLikes,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in get all books route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get recommended books by the logged in user
router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
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

    const booksWithLikes = books.map(book => ({
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
      likes: book.likes.map(like => like.userId)
    }));

    res.json(booksWithLikes);
  } catch (error) {
    console.error("Get user books error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// get single book by ID
router.get("/:id", protectRoute, async (req, res) => {
  try {
    const book = await getBookByIdRaw(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    console.error("Get single book error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: req.params.id }
    });
    
    if (!book) return res.status(404).json({ message: "Book not found" });

    // check if user is the creator of the book
    if (book.userId !== req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }

    await prisma.book.delete({
      where: { id: req.params.id }
    });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error deleting book", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id", protectRoute, upload.single("image"), async (req, res) => {
  try {
    const { title, caption, rating, details } = req.body;
    const file = req.file;

    const book = await prisma.book.findUnique({
      where: { id: req.params.id }
    });
    
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.userId !== req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

    const bookTitle = title || book.title;
    const bookCaption = caption || book.caption;
    const bookDetails = details || book.details;
    const bookRating = rating ? Number(rating) : book.rating;
    const updatedAt = new Date();

    // If new image is provided
    if (file) {
      if (process.env.CLOUDINARY_CLOUD_NAME === "dummy" || !process.env.CLOUDINARY_CLOUD_NAME) {
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        
        await prisma.book.update({
          where: { id: req.params.id },
          data: {
            title: bookTitle,
            caption: bookCaption,
            details: bookDetails,
            rating: bookRating,
            image: base64Image,
            updatedAt
          }
        });

        const updatedBook = await getBookByIdRaw(req.params.id);
        return res.json(updatedBook);
      }

      // upload file to cloudinary
      const uploadResponse = await cloudinary.uploader.upload_stream(
        { folder: "books" },
        async (error, result) => {
          if (error) return res.status(500).json({ message: error.message });
          
          await prisma.book.update({
            where: { id: req.params.id },
            data: {
              title: bookTitle,
              caption: bookCaption,
              details: bookDetails,
              rating: bookRating,
              image: result.secure_url,
              updatedAt
            }
          });

          const updatedBook = await getBookByIdRaw(req.params.id);
          res.json(updatedBook);
        }
      );
      uploadResponse.end(file.buffer);
    } else {
      await prisma.book.update({
        where: { id: req.params.id },
        data: {
          title: bookTitle,
          caption: bookCaption,
          details: bookDetails,
          rating: bookRating,
          updatedAt
        }
      });

      const updatedBook = await getBookByIdRaw(req.params.id);
      res.json(updatedBook);
    }
  } catch (error) {
    console.log("Error updating book", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
