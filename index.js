import "dotenv/config"
import express from "express"
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js"
import locations from "./routes/locations.js"
import properties from "./routes/properties.js"
import userProfile from "./routes/user.js"



const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse JSON
app.use(bodyParser.json()); 

// MongoDB Connection
mongoose.connect(process.env.DATABASE)
  .then(() => {

    console.log("MongoDB connected")

    //routes 
app.use("/api",authRoutes)
app.use("/api",locations)
app.use("/api",properties)
app.use("/api",userProfile)



// Start the server
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
  })
  .catch(err => console.error("MongoDB connection error:", err));




