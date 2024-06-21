import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModal from "./bookModal";
import fs from "node:fs";
import { Authrequest } from "../middlewares/authenticate";
import createHttpError from "http-errors";

// Create Book
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  console.log(req.files);

  const files = req.files as { [filename: string]: Express.Multer.File[] };

  // For Image
  const coverImage = files.coverImage[0];
  const coverImageMimeType = coverImage.mimetype.split("/").at(-1);
  const fileName = coverImage.filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/upload",
    fileName
  );

  // FOR file
  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(
    __dirname,
    "../../public/data/upload",
    bookFileName
  );

  let uploader;
  let bookFileUploadResult;

  // Upload cover image with specific error handling
  try {
    uploader = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    console.log("Cover image upload successful:", uploader);
  } catch (error) {
    console.error("Error uploading cover image to cloudinary:", error);
    // Handle cover image upload error (e.g., send specific error message)
    return res.status(500).json({ error: "Failed to upload cover image" });
  }

  // Upload book file with specific error handling
  try {
    bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-files",
      format: "pdf",
    });
    console.log("book file upload result", bookFileUploadResult);
    console.log("Book file upload successful");
  } catch (error) {
    console.error("Error uploading book file to cloudinary:", error);
    // Handle book file upload error (e.g., send specific error message)
    return res.status(500).json({ error: "Failed to upload book file" });
  }

  // Deleting files from local
  try {
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);
  } catch (error) {
    console.log("file Removing error", error);
    return res.status(500).json({ error: "Failed to remove file" });
  }

  // Create A new Book
  let newBook;
  const _req = req as Authrequest;
  try {
    newBook = await bookModal.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploader.secure_url,
      file: bookFileUploadResult.secure_url,
    });
  } catch (error) {
    console.log("failed to create new book", error);
    return res.status(500).json({ error: "Failed to create new book" });
  }

  // If both uploads succeed, send success response
  if (uploader && bookFileUploadResult) {
    res.status(201).json({ id: newBook._id });
  } else {
    // Handle the case where at least one upload failed
    // (e.g., send a more specific error message)
    res.status(500).json({ error: "Failed to upload book" }); // Generic error for now
  }
};

// Update Book
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  try {
    const book = await bookModal.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const _req = req as Authrequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "You don't have access to update others' books"));
    }

    const files = req.files as { [filename: string]: Express.Multer.File[] };

    let completeCoverImage = book.coverImage;
    if (files.coverImage) {
      const fileName = files.coverImage[0].filename;
      const filePath = path.resolve(__dirname, "../../public/data/upload/" + fileName);

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: "book-covers",
      });

      completeCoverImage = uploadResult.secure_url;
      await fs.promises.unlink(filePath);
    }

    let completeFileName = book.file;
    if (files.file) {
      const bookFileName = files.file[0].filename;
      const bookFilePath = path.resolve(__dirname, "../../public/data/upload/" + bookFileName);

      const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-files",
      });

      completeFileName = uploadResultPdf.secure_url;
      await fs.promises.unlink(bookFilePath);
    }

    const updatedBook = await bookModal.findOneAndUpdate(
      { _id: bookId },
      { title, genre, coverImage: completeCoverImage, file: completeFileName },
      { new: true }
    );

    res.json(updatedBook);
  } catch (error) {
    console.error("Error in updateBook:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

const listBooks = async(req: Request, res: Response, next: NextFunction) =>{
  try {
    const books = await bookModal.find();
    res.json(books);
    
  } catch (error) {
    next(createHttpError(402, 'something went wrong while getting book'))
  }
}


export { createBook, updateBook, listBooks };
