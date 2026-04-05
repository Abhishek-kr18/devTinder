import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/ConnectionRequest.js";

const userRouter = Router();
const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "about","skills"];

//get all the pending connections request
userRouter.get("/users/requests/received", userAuth,async (req, res) => {
    try {
        const loggedInUser = req.user;
        
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate(
            "fromUserId",USER_SAFE_DATA
        );

        res.json({message:"Data Fetched successfully",
            data: connectionRequests,
        });

    }catch(err){
        res.statusCode(400).json("ERROR: " + err.message);
    }
});

userRouter.get("/users/connection", userAuth,async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id, status:"accepted"},
                {toUserId: loggedInUser._id, status:"accepted"},
            ]
        }).populate(
            "fromUserId",
            USER_SAFE_DATA
        )
        .populate(
            "toUserId",
            USER_SAFE_DATA
        );
        const data =connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id){
               return row.fromUserId;
            }
            return row.toUserId;
        });

        res.json({connectionRequests});
    }catch(err){
        res.statusCode(400).json("ERROR: " + err.message);
    }
});

userRouter.get("/feed", userAuth,async (req, res) => {
        try{
                const loggedInUser = req.user;

                const page=parseInt(req.params.page) || 1;
                const limit=parseInt(req.params.limit) || 10;
                limit =limit > 50 ? 50 : limit;
                 const skip=(page-1)*limit;

                const connectionRequests = await ConnectionRequest.find({
                    $or:[
                        {fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}],
                }).select("fromUserId toUserId");

                const hideUsersFromFeed = new Set();
                connectionRequests.forEach(req=>{
                    hideUsersFromFeed.add(req.fromUserId);
                    hideUsersFromFeed.add(req.toUserId);
                });
                console.log(hideUsersFromFeed);

                const users= await User.find({
                    $and:[
                    {_id:{$nin:Array.from(hideUsersFromFeed)} },
                    { _id: { $ne: loggedInUser._id } },
                ],
                })
                 .select(USER_SAFE_DATA)
                 .skip(skip)
                 .limit(limit);

            res.json({ data: users });
        }
        catch(err){
            res.status(400).json({message: err.message});
        }
});
export default userRouter;