import  express  from "express";
import { createUser } from "./userModal";

const userRouter = express.Router();

// Routes
userRouter.post('/register',createUser);

export default userRouter