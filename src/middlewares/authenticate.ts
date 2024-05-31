import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface Authrequest extends Request{
    userId: string
}

const authenticate = (req:Request, res : Response, next: NextFunction) =>{

    const token = req.header('Authorization');
    if(!token) return next(createHttpError(401, 'Authorization token required'));

    try {
        const parsedToken = token.split(' ')[1];
        const decoded = verify(parsedToken, config.jwtSecret as string);
    
        console.log(decoded, 'decoaded');
    
        const _req = req as Authrequest;
        _req.userId = decoded.sub as string
        
    } catch (error) {
        return next(createHttpError(401, 'token expired '));        
    }
    
    next() 
}

export default authenticate;