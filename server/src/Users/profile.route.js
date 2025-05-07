const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Middleware to authenticate users
const authenticate = (req, res, next) => {
    const token = req.header('Authorization') || req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

    try {
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// Set up storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/'); // Save images to 'uploads' inside src
    },
    filename: function (req, file, cb) {
        cb(null, req.user.id + path.extname(file.originalname)); // Save as user ID + file extension
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter });

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update profile
router.put('/profile', authenticate, upload.single('image'), async (req, res) => {
  console.log("File received:", req.file); // Debugging the file object

  if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const { firstname, lastname, phcode, phonenumber, city, churchbranch, state, zipcode, address } = req.body;

      if (!firstname || !lastname || !phcode || !phonenumber) {
          return res.status(400).json({ message: "Firstname, lastname, PHCode, and phone number are required." });
      }


      user.firstname = firstname;
      user.lastname = lastname;
      user.phcode = phcode;
      user.phonenumber = phonenumber;
      user.city = city || user.city;
      user.churchbranch = churchbranch || user.churchbranch;
      user.state = state || user.state;
      user.zipcode = zipcode || user.zipcode;
      user.address = address || user.address;

      if (req.file) {
          user.image = `/uploads/${req.user.id}${path.extname(req.file.originalname)}`;
      }

      user.profileCompleted = true;
      await user.save();

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
        );

        res.json({
            message: 'Profile updated successfully',
            token, // Send token back in the response
        });
  } catch (error) {
      res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;