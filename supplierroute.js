const express = require('express');
const router = express.Router();
const { Supplier } = require('./models');  // Assuming you have your models defined in 'models.js'

// Create (POST) - Add a new supplier
router.post('/suppliers', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        
        const newSupplier = new Supplier({
            name,
            email,
            phone
        });
        const savedSupplier = await newSupplier.save();
        res.status(201).json(savedSupplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Read (GET) - Get all suppliers
router.get('/suppliers', async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read (GET) - Get a supplier by _id
router.get('/suppliers/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);  // Use findById to search by _id
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update (PUT) - Update a supplier by _id
router.put('/suppliers/:id', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,  // Use _id to find the supplier
            { name, email, phone },
            { new: true }  // Returns the updated document
        );
        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json(updatedSupplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete (DELETE) - Delete a supplier by _id
router.delete('/suppliers/:id', async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);  // Use _id to find and delete the supplier
        if (!deletedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;