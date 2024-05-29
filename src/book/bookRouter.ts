import express from "express";
import { createBook } from "./bookController";
import path from "node:path";
import multer from "multer";

const bookRouter = express.Router();

// Add multer middleware
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/upload"),
  limits: { fileSize: 3e7 },
});
// Routes
bookRouter.post(
  "/book",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default bookRouter;
