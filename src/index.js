import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./config/database.js";
import User from "./models/user.js";

const app=express();

app.post("/signup", async (req,res)=>{
    //creating a new instance of a user model
    const user=new User({
         firstName:"ab",
         lastName:"Ku",
         emailId:"abc@gmail.com",
         phoneNo:"7859028434"
    });
   try{
    await  user.save();
   res.send("user added successfully!");
}catch (err){
    res.status(400).send("Error saving the user:" +err.message);
}
});

connectDB() .then(()=>{
     console.log("Database connection established...");
      app.listen(3000, ()=>{ 
        console.log("server is successfully listening on port 3000...");
     }); 
    })
     .catch(err=>{ console.error("Database con not be connected!..:"); 

     });