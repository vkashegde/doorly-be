
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
    const userId = req.user.id; // Assuming you have JWT authentication middleware that attaches the user object
    const { name, email, phone, address } = req.body;
  
    try {
      // Find the user by their ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the user's details (only updating provided fields)
      if (name) user.name = name;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (address) user.address = address;
  
      // Save the updated user data
      await user.save();
  
      // Return the updated user profile
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating profile' });
    }
  };