import express from "express";
import auth from "../middlewares/auth.js";

const profileRouter = express.Router();
import { validateEditProfileData } from "../utils/validations.js";

profileRouter.get("/profile", auth.userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("invalid or malformed token");
  }
});

profileRouter.patch("/profile", auth.userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("invalid edit fields!");
        }
        const loggedInUser = req.user;
        console.log(loggedInUser);

        Object.keys(req.body).forEach((key)=>{
            (loggedInUser[key] = req.body[key]);
        });
         console.log(loggedInUser);
         res.send(`${loggedInUser.firstName} profile updated successfully!!!`);
    }catch(err){
        res.status(400).send("something went wrong: "+err.message);
        
    }
});

export default profileRouter;