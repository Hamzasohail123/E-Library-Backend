import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModal from "./userModal";


const createUser= async (req: Request, res: Response, next: NextFunction)=>{
    //Validation
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        const error =  createHttpError(400, 'all fields are required');
        return next(error);
    }
    // Database call
    const user = await userModal.findOne({email});
    if(user){
        const error = createHttpError(400, 'user already exist with this email');
        return next(error)
    }

    //process
    //response
    res.json({message: "user created succesfully"});
}

export {createUser}