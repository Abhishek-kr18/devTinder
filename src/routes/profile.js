
import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { validateEditProfileData } from "../utils/validations.js";

const profileRouter = express.Router();

const updateProfileHandler = async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("invalid edit fields!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();
    res.send(`${loggedInUser.firstName} profile updated successfully!!!`);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("invalid or malformed token");
  }
});

profileRouter.patch("/profile", userAuth, updateProfileHandler);
profileRouter.patch("/profile/edit", userAuth, updateProfileHandler);

export default profileRouter;