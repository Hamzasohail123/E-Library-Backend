import mongoose from "mongoose";
import { config } from "./config";

const connectDb  =  async() => {
try {
    mongoose.connection.on('connected',()=>{
        console.log('databse coonnect succesfully');
    });
    
    mongoose.connection.on('error',(err)=>{
        console.log('error to connect database', err);
    });

    await mongoose.connect(config.databaseUrl as string);


} catch (error) {
    console.log('failed to connect database',error);
    process.exit(1)
}
}

export default connectDb;