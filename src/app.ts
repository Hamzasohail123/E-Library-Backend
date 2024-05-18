import  express from "express";

const app  = express();


app.get('/',(req,res,nex)=>{
    res.json({message: "welcome to elib apis"})
});

export default app;
