import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";




// Global error handeling this is actually a middleware
const globalErrorHander = (
    (
        err:HttpError,
        req:Request,
        res: Response,
        next:NextFunction) =>{
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        message: err.message,
        // we cant use this in production
        errorStack: config.env === 'development' ? err.stack : '',

    })
});

export default globalErrorHander;