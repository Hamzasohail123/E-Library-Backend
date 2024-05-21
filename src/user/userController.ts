import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModal from "./userModal";
import bcrypt from 'bcrypt'
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";


const createUser= async (req: Request, res: Response, next: NextFunction)=>{
    //Validation
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        const error =  createHttpError(400, 'all fields are required');
        return next(error);
    }
    // Database call
    try {
        const user = await userModal.findOne({email});
        if(user){
            const error = createHttpError(400, 'user already exist with this email');
            return next(error)
        }
        
    } catch (error) {
        return next(createHttpError(500,'error while getting user'))        
    }
  

    // Password hash 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user

    let newUser : User

    try {
            newUser = await userModal.create({
            name,
            email,
            password: hashedPassword
        });
        
    } catch (error) {
        return next(createHttpError(500, 'error while creating user'))        
    }

  

    try {
            // Token Generation
        const token = sign({sub:newUser._id},config.jwtSecret as string,
            {expiresIn:'7d'});
        
            //process
            //response
            res.json({accessToken: token});
        
    } catch (error) {
        return next(createHttpError(500, 'error while creating jst token'))        
    }

 
}

export {createUser}