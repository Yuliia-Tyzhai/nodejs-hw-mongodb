import { Schema, model } from "mongoose";

import { emailRegexp } from "../../constants/users.js";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {versionKey: false, timestamps: true});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  };
  

const User = model("user", userSchema);

export default User;