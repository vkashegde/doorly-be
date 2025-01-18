import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import twilio from "twilio";
import User from "../models/User.js";

export const login = async (req, res) => {
    // Initialize Twilio client
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  
    const { mobile } = req.body;
  
    try {
      // Generate OTP and expiry
      //const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otp = "123456";
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
      // Find or create user
      let user = await User.findOne({ mobile });
      if (!user) {
        user = new User({ mobile });
      }
  
      // Hash the OTP for security
      user.otp = bcrypt.hashSync(otp, 10);
      user.otpExpiry = otpExpiry;
      await user.save();
  
      // Debug: Log generated OTP (remove this in production)
      console.log(`Generated OTP for ${mobile}: ${otp}`);
  
      // Send OTP via Twilio
      // const message = await client.messages.create({
      //   body: `Your OTP is ${otp}`,
      //   from: process.env.TWILIO_PHONE, // Ensure this is a valid Twilio number
      //   to: mobile,
      // });
  
      //console.log(`Twilio Message SID: ${message.sid}`); // Log message SID for tracking
  
      res.status(200).json({ message: "OTP sent successfully",otp:otp });
    } catch (err) {
      // Enhanced error handling
      console.error("Error sending OTP:", err);
  
      if (err.code === 21212) {
        // Twilio error for invalid "From" number
        return res.status(400).json({
          error: "Invalid Twilio phone number. Please verify your Twilio settings.",
        });
      }
  
      if (err.code === 21614) {
        // Twilio error for invalid recipient number
        return res.status(400).json({
          error: "Invalid recipient phone number. Please check the number format.",
        });
      }
  
      res.status(500).json({ error: "Error sending OTP. Please try again later." });
    }
  };

export const otpVerify = async(req,res)=>{

    const { mobile, otp } = req.body;

    try {
      const user = await User.findOne({ mobile });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (new Date() > user.otpExpiry) {
        return res.status(400).json({ error: "OTP expired" });
      }
  
      const isOtpValid = bcrypt.compareSync(otp, user.otp);
      if (!isOtpValid) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
  
      const token = jwt.sign({ id: user._id, mobile: user.mobile }, process.env.JWT_SECRET, { expiresIn: "30d" });
      user.jwtToken = token;
      await user.save();
  
      res.status(200).json({ message: "OTP verified successfully", token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error verifying OTP" });
    }


}

export const verifyToken = async (req, res) => {
    const token = req.headers["authorization"]; // JWT token from frontend, usually in the Authorization header
  
    if (!token) {
      return res.status(401).json({ error: "No token provided." });
    }
  
    try {
      // Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Optionally, you can add additional checks like user ID validation here
      res.status(200).json({ message: "Token is valid", user: decoded });
    } catch (err) {
      console.error("JWT verification error:", err);
      res.status(401).json({ error: "Invalid or expired token." });
    }
  };