import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModal from "./userModal";
import bcrypt from 'bcrypt'
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";


// Signup User
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
    let newUser : User;
    try {
            newUser = await userModal.create({
            name,
            email,
            password: hashedPassword
        });
        
    } catch (error) {
        return next(createHttpError(500, 'error while creating user'))        
    }

  
    // Token Generation
    try {
        const token = sign({sub:newUser._id},config.jwtSecret as string,
            {expiresIn:'7d'});
        
            //process
            //response
            res.status(201).json({accessToken: token});
        
    } catch (error) {
        return next(createHttpError(500, 'error while creating jst token'))        
    }

 
}


//Login User
const loginUser = async (req:Request, res:Response, next:NextFunction)  =>{

    // Validation
    const {email, password} = req.body;
    if(!email || !password){
        return next(createHttpError(400, 'all fields are require'))
    }
    
    // Checking user exist in database or not
    const user = await userModal.findOne({email});
    if(!user){
        return next(createHttpError(400, 'user not found'))
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return next(createHttpError(400, 'invalid credentials'))
    }
    // Token Generation
    const token = sign({sub:user._id}, config.jwtSecret as string,
        {expiresIn: '7d'});

    res.json({accessToken:token});    
}

export {createUser, loginUser}