import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./config/database.js";
import User from "./models/user.js";
import { validateSignUpData } from "./utils/validations.js";
import bcrypt from "bcrypt";

const app=express();

app.use(express.json()); 

app.post("/signup", async (req,res)=>{
    try{ 

    // Validate signup data
    validateSignUpData(req);
    //creating a new instance of a user model
    const {firstName,lastName,emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);


    const user = new User({ ...req.body,firstName,lastName,emailId, password: passwordHash });

    await user.save();
    res.send("user added successfully!");
} catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
}
 });

 app.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        throw new Error("invalid email or not present in DB!");


        const isPasswordValid=await bcrypt.compare("password",user.password);

        if(isPasswordValid){
            res.send("login successful!");
        } else{
            throw new Error("invalid password!");
        }
        

    }catch(err){
        res.status(400).send("something went wrong");
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

app.patch("/user/:userId",async(req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;

try{
    const ALLOWED_UPDATES=["photoUrl","about","gender","skills","age"];
    const isUpdateAllowed=Object.keys(data).every((k)=>
    ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdateAllowed){
        throw new Error("update not allowed!");
    }
    const user=await User.findByIdAndUpdate({_id: userId},data,{
        returnDocument:"after",
        runValidators:true,
    });
    console.log(user);
    res.send("user updated successfully!");
  } catch(err){
    res.status(400).send("UPDATE FAILED:"+err.message);
  }
});

connectDB()
 .then(()=>{
     console.log("Database connection established...");
      app.listen(3000, ()=>{ 
        console.log("server is successfully listening on port 3000...");
     }); 
    })
     .catch(err=>{ console.error("Database con not be connected!..:"); 

     });