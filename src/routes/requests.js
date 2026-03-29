import express from "express";
import auth from "../middlewares/auth.js";

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", auth.userAuth, async (req, res) => {
  const user = req.user;
  console.log("sending a connection request");
  res.send(`${user.firstName} connection request sent successfully!!!`);
});

export default requestRouter;