import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.files);

  const files = req.files as { [filename: string]: Express.Multer.File[] };


  // For Image 
  const coverImage = files.coverImage[0];
  const coverImageMimeType = coverImage.mimetype.split('/').at(-1);
  const fileName = coverImage.filename;
  const filePath = path.resolve(__dirname, '../../public/data/upload', fileName);

  // FOR file 
  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(__dirname, '../../public/data/upload', bookFileName);

  let uploader;
  let bookFileUploadResult;

  try {
    // Upload cover image with specific error handling
    uploader = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: 'book-covers',
      format: coverImageMimeType,
    });
    console.log("Cover image upload successful:", uploader);
  } catch (error) {
    console.error("Error uploading cover image to cloudinary:", error);
    // Handle cover image upload error (e.g., send specific error message)
    return res.status(500).json({ error: "Failed to upload cover image" });
  }

  try {
    // Upload book file with specific error handling
    bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: 'raw',
      filename_override: bookFileName,
      folder: 'book-files',
      format: 'pdf'
    });
    console.log('book file upload result', bookFileUploadResult);
    console.log("Book file upload successful");
  } catch (error) {
    console.error("Error uploading book file to cloudinary:", error);
    // Handle book file upload error (e.g., send specific error message)
    return res.status(500).json({ error: "Failed to upload book file" });
  }

  // If both uploads succeed, send success response
  if (uploader && bookFileUploadResult) {
    res.status(200).json({ message: "Book created successfully", uploader, bookFileUploadResult });
  } else {
    // Handle the case where at least one upload failed
    // (e.g., send a more specific error message)
    res.status(500).json({ error: "Failed to upload book" }); // Generic error for now
  }
};

export { createBook };
