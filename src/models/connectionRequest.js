 import { Schema, model } from "mongoose";

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`,
        },
    },
  },
{ timestamps: true }
);

connectionRequestSchema.pre("save", function() {
    const connectionRequest = this;
    // Check if the fromUserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    }
}); 

const ConnectionRequestModel = model("ConnectionRequest", connectionRequestSchema);

export default ConnectionRequestModel;

