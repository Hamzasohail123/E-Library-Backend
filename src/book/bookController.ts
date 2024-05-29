import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.files);
    const files = req.files as { [filename: string]: Express.Multer.File[] };

    const coverImage = files.coverImage[0];
    const coverImageMimeType = coverImage.mimetype.split('/').at(-1);
    const fileName = coverImage.filename;
    const filePath = path.resolve(__dirname, '../../public/data/upload', fileName);

    try {
        const uploader = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: 'book-covers',
            format: coverImageMimeType,
        });
        // Handle successful upload if needed
        console.log("Upload successful:", uploader);
        // Send response to client
        res.status(200).json({ message: "Book created successfully", uploader });
    } catch (error) {
        // Handle the error
        console.error("Error uploading to cloudinary:", error);
        // Send error response to client
        res.status(500).json({ error: "Failed to upload to cloudinary" });
    }
};

export { createBook };








// // Import necessary modules
// import { v2 as cloudinary } from 'cloudinary';
// import { Request, Response } from "express";
// import path from "path";
// import { config } from '../config/config';

// // Configure Cloudinary with credentials
// cloudinary.config({ 
//       cloud_name: config.cloudinaryCloudName, 
//         api_key: config.cloudinaryApiKey, 
//        api_secret: config.cloudinaryApiSecret  
// });

// // Define the controller function for creating a book
// const createBook = async (req: Request, res: Response) => {
//     try {
//         // Extract the cover image file from the request
//         const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//         const coverImage = files.coverImage[0];
//         const fileName = coverImage.filename;
//         const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);
        
//         // Upload the cover image to Cloudinary
//         const uploadResult = await cloudinary.uploader.upload(filePath, {
//             folder: 'book-covers', // Set the folder in Cloudinary
//             overwrite: true // Overwrite existing file if any
//         });
        
//         // Send success response with Cloudinary upload result
//         res.status(200).json({ message: "Book created successfully", uploadResult });
//     } catch (error) {
//         // Handle any errors that occur during the upload process
//         console.error("Error uploading to Cloudinary:", error);
//         res.status(500).json({ error: "Failed to upload to Cloudinary" });
//     }
// };

// // Export the controller function
// export { createBook };

