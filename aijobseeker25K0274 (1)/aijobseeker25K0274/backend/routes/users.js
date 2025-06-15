const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get user profile by email
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update or create user profile
router.put('/:email', upload.single('logo'), async (req, res) => {
  try {
    // First check if user exists
    let user = await User.findOne({ email: req.params.email });
    
    // Prepare update fields
    const updateFields = {
      ...req.body,
      email: req.params.email, // Ensure email matches the URL parameter
      // Only update fields that are provided in the request
      ...(req.body.companyName && { companyName: req.body.companyName }),
      ...(req.body.phone && { phone: req.body.phone }),
      ...(req.body.location && { location: req.body.location }),
      ...(req.body.website && { website: req.body.website }),
      ...(req.body.description && { description: req.body.description }),
      ...(req.body.industry && { industry: req.body.industry }),
      ...(req.body.companySize && { companySize: req.body.companySize }),
      ...(req.body.foundedYear && { foundedYear: parseInt(req.body.foundedYear) })
    };

    // If a new logo was uploaded, update the logo field
    if (req.file) {
      updateFields.logo = `/uploads/${req.file.filename}`;
    }

    if (!user) {
      // Create new user if they don't exist
      // Generate a random password since we don't have it
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Math.random().toString(36), salt);
      
      // Extract name from email for required fields
      const emailName = req.params.email.split('@')[0];
      const firstName = emailName.split('.')[0] || emailName;
      const lastName = emailName.split('.')[1] || 'User';
      
      user = new User({
        ...updateFields,
        password: hashedPassword,
        role: 'employer',
        // Add required fields
        firstName: firstName,
        lastName: lastName,
        phoneNumber: req.body.phone || '0000000000' // Use provided phone or default
      });
      
      await user.save();
    } else {
      // Update existing user
      user = await User.findOneAndUpdate(
        { email: req.params.email },
        { $set: updateFields },
        { new: true, runValidators: true }
      );
    }

    if (!user) {
      return res.status(404).json({ message: 'Failed to create/update user' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating/creating user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all users (for admin purposes)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 