import express from "express";
import bcrypt from "bcrypt";
import { validateSignUpData } from "../utils/validations.js";
import User from "../models/user.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      ...req.body,
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const saveUser = await user.save();
    const token = await saveUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json({message: "user added successfully!",data:saveUser});
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("invalid email or not present in DB!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("invalid password!");
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: false,
    });

    const userData = user.toObject();
    delete userData.password;

    res.send({
      message: "Login successful",
      user: userData,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(0),
        httpOnly: true,
        secure: false,
    });
    res.send("logout successful!!!");
});

export default authRouter;