import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./config/database.js";
import User from "./models/user.js";

const app=express();

app.use(express.json());

app.post("/signup", async (req,res)=>{
    console.log(req.body);
    //creating a new instance of a user model
    const user=new User(req.body);
   try{
    await  user.save();
   res.send("user added successfully!");
}catch (err){
    res.status(400).send("Error saving the user:" +err.message);
}
 });

 //get user by email
 app.get("/user",async (req,res)=>{
    const userEmail=req.body.emailId;


    try{
        const user=await  User.find({emailId:userEmail});
        res.send(user);
    }
    catch(err){
        res.status(400).send("something went wrong");

    }
 });

 app.get("/feed",(req,res)=>{

 });

 app.delete("/user",async(req,res)=>{
    const userId=req.body.userId;
    try{ 
        const user=await User.findByIdAndDelete(userId);
        res.send("user deleted successfully!");

    }catch(err){
        res.status(400).send("something went wrong");
    }

 });

 app.patch("/user",async(req,res)=>{
    const userId=req.body.userId;
    const data=req.body;
    try{
        await User.findByIdAndUpdate({_id:userId},data);
        res.send("user updated successfully!");
    }catch(err){
        res.status(400).send("something went wrong");
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