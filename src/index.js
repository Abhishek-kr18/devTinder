import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./config/database.js";
import User from "./models/user.js";
import { validateSignUpData } from "./utils/validations.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import auth from "./middlewares/auth.js";

const app=express();
app.use(express.json()); 
app.use(cookieParser());

app.post("/signup", async (req,res )=>{
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
            if(!user){
        throw new Error("invalid email or not present in DB!");
     }
        const isPasswordValid= await bcrypt.compare(password,user.password);

        if(isPasswordValid){

            const token = jwt.sign({_id: user._id},"Dev@Tinder$284");
            console.log(token);

            // creation of JWT token cookie (now using the signed token)
            res.cookie("token", token, { httpOnly: true, secure: false });
            res.send("login successful!!!");
        } else{
            throw new Error("invalid password!");
        }
        
    }catch(err){
        res.status(400).send("something went wrong");
    }
});

app.get("/profile", auth.userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        return res.status(401).send("invalid or malformed token");
    }
});

app.post("/sendConnectionRequest",auth.userAuth ,async(req,res)=>{
    const user=req.user;
    console.log("sending a connection request");

res.send(user.firstName+"connection request sent successfully!!!");
});
 //get user by email
connectDB()
 .then(()=>{
     console.log("Database connection established...");
      app.listen(3000, ()=>{ 
        console.log("server is successfully listening on port 3000...");
     }); 
    })
     .catch(err=>{ console.error("Database con not be connected!..:"); 

     });