
import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { validateEditProfileData } from "../utils/validations.js";

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("invalid or malformed token");
  }
});

profileRouter.patch("/profile", userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("invalid edit fields!");
        }
        const loggedInUser = req.user;
        console.log(loggedInUser);

        Object.keys(req.body).forEach((key)=>{
            (loggedInUser[key] = req.body[key]);
        });
        await loggedInUser.save();
         console.log(loggedInUser);
         res.send(`${loggedInUser.firstName} profile updated successfully!!!`);
    }catch(err){
        res.status(400).send("Error: "+err.message);
        
    }
});

export default profileRouter;