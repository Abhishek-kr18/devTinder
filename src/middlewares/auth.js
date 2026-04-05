import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const userAuth = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token;
    const authHeader = req.get("Authorization") || req.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    const token = cookieToken || bearerToken;

    if (!token) {
      return res.status(401).send("unauthorized access: token missing");
    }

    let decodedObj;
    try {
      decodedObj = jwt.verify(token, "Dev@Tinder$284");
    } catch (err) {
      return res.status(401).send("unauthorized access: invalid token");
    }

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).send("unauthorized access: user not found");
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error("userAuth error:", err);
    return res.status(401).send("unauthorized access");
  }
};