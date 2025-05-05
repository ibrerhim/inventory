const jwt = require('jsonwebtoken');
require('dotenv').config();

// Use the secret key from the environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify token and check if the user is an admin
const authorizeAdmin = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Check if the token is in the "Bearer <token>" format
    const tokenPart = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    // Verify the token
    jwt.verify(tokenPart, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // After token verification, check if the user's role is 'admin'
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // If the user is an admin, allow access to the next middleware or route
        req.user = decoded;  // Store the decoded token payload in the request object
        next();
    });
};

module.exports = authorizeAdmin;