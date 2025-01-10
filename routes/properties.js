import express from "express";
import { createProperty,editProperty,deleteProperty,getPropertiesByCity,getAllProperties,getPropertyDetails,getPropertiesForRent,getPropertiesForSale,getFeaturedProperties,searchProperties } from "../controllers/properties.js";


const router = express.Router()

router.post("/create-property",createProperty)
router.post("/edit-property",editProperty)
router.post("/delete-property",deleteProperty)
router.get('/properties', getAllProperties);
router.get('/properties/:city', getPropertiesByCity);
router.get('/property-details/:id', getPropertyDetails);
router.get('/properties-for-rent', getPropertiesForRent);
router.get('/properties-for-sale', getPropertiesForSale);
router.get('/featured-properties', getFeaturedProperties);
router.get('/properties-search', searchProperties);

export default router;