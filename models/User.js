import mongoose from "mongoose";

const {Schema,model} = mongoose;



const userSchema = new Schema({
    mobile: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpiry: { type: Date },
    jwtToken: { type: String },
    profile: {
      name: { type: String },
      email: { type: String }
    }




})


export default model("User",userSchema);

