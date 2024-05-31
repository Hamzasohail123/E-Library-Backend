import express from "express";
import { createBook } from "./bookController";
import path from "node:path";
import multer from "multer";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router();

// Add multer middleware
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/upload"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Routes
bookRouter.post(
  "/book",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default bookRouter;
