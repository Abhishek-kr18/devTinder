import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String
  },
  password: {
    type: Number  
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  }
});

export default model("User", userSchema);