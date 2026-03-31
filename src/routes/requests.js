import express from "express";
import auth from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

const requestRouter = express.Router();

requestRouter.post(
  "/request/sent/:status/:toUserId",
   auth.userAuth, 
   async (req, res) => {
    try{
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status= req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
        .status(400)
        .json({ message: "Invalid status type:"+status });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
          return res.status(404).json({ message: "User not found" });
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
          $or:[
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
          ],
        });
        if(existingConnectionRequest){
          return res
          .status(400)
          .send({ message: "Connection request already exists" });
        }

      const connectionRequest= new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
 
      const data = await connectionRequest.save();

      res.json({
        message: req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    }catch(err){
      res.status(400).send("Error: " + err.message);
    }
 }
);

export default requestRouter;