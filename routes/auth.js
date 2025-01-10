import expres, { Router } from "express"
import { login ,otpVerify, verifyToken } from "../controllers/auth.js";

const router = expres.Router();

router.post("/login", login );

router.post("/verify-otp",otpVerify);

router.get("/verify-token", verifyToken);





export default router;