import express from "express";
import { updateProfile } from "../controllers/user.js";



const router = express.Router()

router.put('/users/profile', updateProfile);


export default router;