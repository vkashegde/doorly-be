import express from "express";
import { getCities ,topLocalities} from "../controllers/locations.js";

const router = express.Router()

router.get("/cities",getCities)
router.get("/top-localities",topLocalities)



export default router;