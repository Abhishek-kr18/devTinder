import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

    await user.save();
    res.send("user added successfully!");
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

    const token = jwt.sign({ _id: user._id }, "Dev@Tinder$284");
    res.cookie("token", token, { httpOnly: true, secure: false });
    res.send("login successful!!!");
  } catch (err) {
    res.status(400).send("something went wrong: " + err.message);
  }
});

export default authRouter;