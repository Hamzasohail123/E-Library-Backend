import  express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import globalErrorHander from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app  = express();
app.use(express.json());


app.get('/',(req,res,nex)=>{

    res.json({message: "welcome to elib apis"})
});

app.use('/api/users', userRouter);

app.use('/api/books', bookRouter);

app.use(globalErrorHander);

export default app;
