import Property from "../models/Property.js";
import User from "../models/User.js";






export const createProperty = async(req,res)=>{

    const { property_info, sale_details, property_description, userId } = req.body;

    try {
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      // Create a new property document
      const newProperty = new Property({
        property_info,
        sale_details,
        property_description,
        user: user._id, // Associate property with the user who posted it
      });
  
      // Save the property to the database
      await newProperty.save();
  
      res.status(201).json({ message: 'Property posted successfully', property: newProperty });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error posting property' });
    }



}


export const editProperty = async (req, res) => {
  const { propertyId } = req.params; // Property ID passed in the URL
  const { property_info, sale_details, property_description } = req.body;

  try {
    // Find the property by ID
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Update the property details
    property.property_info = property_info || property.property_info;
    property.sale_details = sale_details || property.sale_details;
    property.property_description = property_description || property.property_description;

    // Save the updated property
    await property.save();

    res.status(200).json({ message: 'Property updated successfully', property });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating property' });
  }
};


export const deleteProperty = async (req, res) => {
  const { propertyId } = req.params; // Property ID passed in the URL

  try {
    // Find the property by ID and delete it
    const property = await Property.findByIdAndDelete(propertyId);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting property' });
  }
};

export const getPropertiesByCity = async (req, res) => {
  const { city } = req.params; // Extract the city name from the URL parameter

  try {
    // Find all properties where the property location matches the city
    const properties = await Property.find({
      'property_info.property_location': { $regex: new RegExp(city, 'i') }
    });

    if (properties.length === 0) {
      return res.status(200).json({ properties });
    }

    res.status(200).json({ properties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching properties' });
  }
}

export const getAllProperties = async (req, res) => {
  try {
    // Fetch all properties from the database
    const properties = await Property.find();

    // Check if properties exist
    if (properties.length === 0) {
      return res.status(404).json({ message: 'No properties found' });
    }

    // Return the list of properties
    res.status(200).json({ properties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching properties' });
  }
};

export const getPropertyDetails = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the property by ID
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Return the property details
    res.status(200).json({ property });
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid property ID' });
    }
    res.status(500).json({ error: 'Error fetching property details' });
  }
};



export const getPropertiesForRent = async (req, res) => {
  try {
    // Find all properties with sale_type as "Rent"
    const properties = await Property.find({ "sale_details.sale_type": "Rent" });

    if (properties.length === 0) {
      return res.status(404).json({ message: 'No properties available for rent' });
    }

    // Return the list of properties
    res.status(200).json({ properties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching properties for rent' });
  }
};

export const getPropertiesForSale = async (req, res) => {
  try {
    // Find all properties with sale_type as "Rent"
    const properties = await Property.find({ "sale_details.sale_type": "Sale" });

    if (properties.length === 0) {
      return res.status(404).json({ message: 'No properties available for Sale' });
    }

    // Return the list of properties
    res.status(200).json({ properties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching properties for rent' });
  }
};


export const getFeaturedProperties = async (req, res) => {
  try {
    // Query properties with isFeatured: true
    const featuredProperties = await Property.find({ isFeatured: true });

    if (featuredProperties.length === 0) {
      return res.status(404).json({ message: 'No featured properties found' });
    }

    // Return featured properties
    res.status(200).json({ featuredProperties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching featured properties' });
  }
};


const VALID_LOCATIONS = ["bangalore", "mumbai", "delhi", "pune", "chennai", "kolkata", "hyderabad", "ahmedabad", "jaipur", "lucknow"];

export const searchProperties = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    // Tokenize the query
    const searchTerms = query.toLowerCase().split(' ');

    // Extract location from the query
    const location = searchTerms.find(term => VALID_LOCATIONS.includes(term));
    if (!location) {
      return res.status(400).json({ error: "A valid location must be included in the query" });
    }

    // Extract numeric terms for bedrooms (e.g., 1 from "1bhk")
    const numberTerms = searchTerms
      .filter(term => term.includes('bhk'))
      .map(term => parseInt(term[0], 10));

    // Build filters
    const filters = {
      $and: [
        { "property_info.property_location": location }, // Strict match for location
        {
          $or: [
            { "property_description.description": { $regex: searchTerms.join('|'), $options: "i" } },
            ...(numberTerms.length > 0
              ? [{ "property_description.no_of_bedroom": { $in: numberTerms } }]
              : []),
          ],
        },
      ],
    };

    // Fetch properties
    const properties = await Property.find(filters);

    if (properties.length === 0) {
      console.log("Filters:", JSON.stringify(filters, null, 2)); // Debugging: Check applied filters
      return res.status(404).json({ message: "No matching properties found for the specified query" });
    }

    res.status(200).json({ properties });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error searching properties" });
  }
};

