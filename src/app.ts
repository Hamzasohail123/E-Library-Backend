import  express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import globalErrorHander from "./middlewares/globalErrorHandler";
import userRouter from "./config/user/userRouter";

const app  = express();


app.get('/',(req,res,nex)=>{

    res.json({message: "welcome to elib apis"})
});

app.use('/api/users', userRouter);

app.use(globalErrorHander);

export default app;
