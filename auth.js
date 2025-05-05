const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Use the secret key from the environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint to verify JWT from the frontend request
router.post('/verify-token', (req, res) => {
    // Extract the token from the request body or headers
    const token = req.body.token || req.headers['authorization'];

    if (!token) {
        return res.status(400).json({ message: 'Token not provided' });
    }

    // Check if token is in the "Bearer <token>" format
    const tokenPart = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    jwt.verify(tokenPart, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Send back the decoded payload (user info)
        res.status(200).json({
            message: 'Token is valid',
            user: decoded  // This will include the payload like id, username, role, etc.
        });
    });
});

// Endpoint to verify token and check if user role is admin
router.post('/verify-admin', (req, res) => {
    // Extract the token from the request body or headers
    const token = req.body.token || req.headers['authorization'];

    if (!token) {
        return res.status(400).json({ message: 'Token not provided' });
    }

    // Check if token is in the "Bearer <token>" format
    const tokenPart = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    jwt.verify(tokenPart, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Check if the user's role is 'admin'
        if (decoded.role === 'admin') {
            return res.status(200).json({ message: 'User is an admin', user: decoded });
        } else {
            return res.status(403).json({ message: 'Access denied. User is not an admin' });
        }
    });
});

module.exports = router;