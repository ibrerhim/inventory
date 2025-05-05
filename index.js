const express = require('express');
const cors = require('cors'); // Import CORS
const mongoose = require('./dbconnection'); // Import MongoDB connection
const userRoutes = require('./userroute');  // Import user routes
const productRoutes = require('./productroute');  // Import product routes
const supplierRoutes = require('./supplierroute');  // Import supplier routes
const salesRoute = require('./salesroute');
const auth = require('./auth');
const app = express();
const port = 3000;

// Middleware to enable CORS
app.use(cors()); // Use CORS middleware

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use('/api', userRoutes);        // Prefix all user routes with /api/users
app.use('/api', productRoutes);  // Prefix all product routes with /api/products
app.use('/api', supplierRoutes);
app.use('/api', salesRoute);
app.use('/api', auth);
  // Prefix all supplier routes with /api/suppliers

// Start the server
app.listen(port, () => {
    console.log('Server is running on port'+'' +port);
});