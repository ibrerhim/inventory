const express = require('express');
const router = express.Router();
const { User } = require('./models');  // Assuming you have your models defined in 'models.js'
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();  // Load environment variables from .env file

// Use the JWT secret key stored in the environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// Create (POST) - Add a new user



router.post('/users', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if username already exists
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Check if email already exists if it is provided
        if (email) {
            const existingUserByEmail = await User.findOne({ email });
            if (existingUserByEmail) {
                return res.status(409).json({ message: 'Email already exists' });
            }
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email: email || null, // Set email to null if it is empty
            password: hashedPassword,
            role
        });

        const savedUser = await newUser.save();

        // Respond with success message and saved user details (excluding password)
        const userResponse = {
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            role: savedUser.role,
            dateCreated: savedUser.dateCreated
        };
        res.status(201).json({ message: 'User created successfully', user: userResponse });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: 'An error occurred while creating the user' });
    }
});




// Read (GET) - Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read (GET) - Get a user by _id
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);  // Use findById to search by _id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update (PUT) - Update a user by _id
router.put('/users/:id', async (req, res) => {
    try {
        const { username, email, role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,  // Use _id to find the user
            { username, email, role },
            { new: true }  // Returns the updated document
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete (DELETE) - Delete a user by _id
router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);  // Use _id to find and delete the user
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login (POST) - User login using username
router.post('/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT payload
        const payload = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        // Generate JWT using the secret key from environment variable
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

        // Send JWT to the front end
        res.status(200).json({ message: 'Login successful', token });
      
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;