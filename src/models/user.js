import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  firstName: {
    type: String,
    required :true,
    minLength:4,
    maxLength:50,
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String,
    lowerCase: true,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
         throw new Error("invalid email address: " + value);
      }
    },
  },
  password: {
    type: String,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
         throw new Error("Enter a strong password: " + value);
      }
    },
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

userSchema.methods.getJWT=async function(){
  const user = this;

  const token = await jwt.sign({_id: user._id}, "Dev@Tinder$284", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword=async function(passwordInputByUser){
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
     passwordHash
    );
    return isPasswordValid;
};

export default model("User", userSchema);
