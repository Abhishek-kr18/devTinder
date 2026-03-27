import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required :true
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String,
    required :true,
    unique :true
  },
  password: {
    type: String 
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  },
  photoUrl: {
    type: String,
    default:"https://imgs.search.brave.com/ym-_u0PNwGk8QnySE3Hq9Iw9wPNY7xzwOBiXXiqzvwE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvMTQ4/NTYxMDUvcGV4ZWxz/LXBob3RvLTE0ODU2/MTA1LmpwZWc_YXV0/bz1jb21wcmVzcyZj/cz10aW55c3JnYiZk/cHI9MSZ3PTUwMA"
  },
  about: {
    type: String,
    default: "Hey there! I'm using DevTinder."
  },
  skills: {
    type: [String]
  }
}, {
  timestamps: true
});

export default model("User", userSchema);