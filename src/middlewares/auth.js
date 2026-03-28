import jwt from "jsonwebtoken";
import User from "../models/user.js";

const userAuth=async(req,res,next)=>{
    try{
    //read the token form the req cookies
    const {token}=req.cookies;

    if(!token){
        throw new Error("token not found!!!!!");
    }

    const decodedObj=await jwt.verify(token,"Dev@Tinder$284");

    const {_id}=decodedObj;

    const user=await User.findById(_id);
    if(!user){
        throw new Error("user not found");
    }
    req.user=user;
    next();
} catch(err){
        res.status(401).send("unauthorized access");
    }

};
    //validate the token 
    //find the user

export default {
    userAuth,
};