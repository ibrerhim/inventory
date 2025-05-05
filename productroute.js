const express = require('express');
const router = express.Router();
const { Product } = require('./models');  // Assuming you have your models defined in 'models.js'

// Create (POST) - Add a new product
router.post('/products', async (req, res) => {
    try {
        const { name, price, purchaseprice, quantity, profit, supplier } = req.body;
        
        const newProduct = new Product({
            name,
            price,
            purchaseprice,
            quantity,
            profit,
            supplier
        });
        
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.patch('/products/:id', async (req, res) => {
    const { id } = req.params;  // Matches `productId`
    const { quantitySold } = req.body;

    console.log(`Product ID: ${id}, Quantity Sold: ${quantitySold}`);

    // Proceed with finding and updating the product
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
       

        product.quantity -= quantitySold;
        await product.save();

        res.json({ message: 'Stock updated successfully', product });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ error: 'Failed to update stock' });
    }
});


// Read (GET) - Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read (GET) - Get a product by _id
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);  // Use findById to search by _id
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update (PUT) - Update a product by _id
router.put('/products/:id', async (req, res) => {
    try {
        const { name, price, purchaseprice, quantity, profit, supplier } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,  // Use _id to find the product
            { name, price, purchaseprice, quantity, profit, supplier, dateUpdated: Date.now() },
            { new: true }  // Returns the updated document
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete (DELETE) - Delete a product by _id
router.delete('/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);  // Use _id to find and delete the product
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
