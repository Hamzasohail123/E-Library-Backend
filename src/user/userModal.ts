import mongoose from "mongoose";
import { User } from "./userTypes";

const userSchema = new mongoose.Schema<User>({
    name:{
        type: String,
        required: true
    },

    email:{
        type:String,
        required: true,
        unique: true
    },

    password:{
        type:String,
        required: true
    },
},
{timestamps: true}
);

// users name add by mongodb if you wanna change then pass in third parameter in string
export default mongoose.model<User>('User', userSchema);
