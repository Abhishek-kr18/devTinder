import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

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
        const data = connectionRequests.map((row) => {
            const connectedUser = row.fromUserId._id.toString() === loggedInUser._id.toString()
                ? row.toUserId
                : row.fromUserId;

            return {
                userId: connectedUser._id,
                firstName: connectedUser.firstName,
                lastName: connectedUser.lastName,
                name: `${connectedUser.firstName} ${connectedUser.lastName}`.trim(),
                photoUrl: connectedUser.photoUrl,
            };
        });

        res.json({ data });
    }catch(err){
        res.status(400).json("ERROR: " + err.message);
    }
});

userRouter.get("/feed", userAuth,async (req, res) => {
        try{
                const loggedInUser = req.user;

        const page = parseInt(req.query.page, 10) || 1;
        let limit = parseInt(req.query.limit, 10) || 10;
        limit = limit > 50 ? 50 : limit;
                 const skip=(page-1)*limit;

                const connectionRequests = await ConnectionRequest.find({
                    $or:[
                        {fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}],
                }).select("fromUserId toUserId");

                const hideUsersFromFeed = new Set();
                connectionRequests.forEach((request)=>{
                    hideUsersFromFeed.add(request.fromUserId);
                    hideUsersFromFeed.add(request.toUserId);
                });

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