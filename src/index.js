import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app=express();
import { connectDB } from "./config/database.js";
import cookieParser from "cookie-parser";


app.use(express.json()); 
app.use(cookieParser());

import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/requests.js";

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


connectDB()
 .then(()=>{
     console.log("Database connection established...");
      app.listen(3000, ()=>{ 
        console.log("server is successfully listening on port 3000...");
     }); 
    })
     .catch(err=>{
         console.error("Database con not be connected!..:"); 
     });