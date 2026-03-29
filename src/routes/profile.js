import express from "express";
import auth from "../middlewares/auth.js";

const profileRouter = express.Router();

profileRouter.get("/profile", auth.userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("invalid or malformed token");
  }
});

export default profileRouter;