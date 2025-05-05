const express = require('express');
const router = express.Router();
const { Sales } = require('./models'); 

router.post('/sales', async (req, res) => {
    try {
      const sale = new Sales(req.body);
      const savedSale = await sale.save();
      res.status(201).json(savedSale);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  // Get the next saleid by fetching the highest saleid and adding one
router.get('/sales/next-saleid', async (req, res) => {
  try {
      const highestSale = await Sales.findOne().sort({ saleid: -1 }).select('saleid');
      const nextSaleId = highestSale ? highestSale.saleid + 1 : 1;  // Start with 1 if no sales exist
      res.json({ nextSaleId });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

  // Get all sales
  router.get('/sales', async (req, res) => {
    try {
      const sales = await Sales.find();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.put('/sales/:id', async (req, res) => {
    try {
      const updatedSale = await Sales.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
      if (!updatedSale) return res.status(404).json({ message: 'Sale not found' });
      res.json(updatedSale);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  router.get('/sales/:saleid', async (req, res) => {
    const { saleid } = req.params;

    try {
        // Find the sale by saleid
        const saleRecord = await Sales.findOne({ saleid: saleid });

        if (!saleRecord) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        // Return the found sale record
        res.status(200).json(saleRecord);
    } catch (error) {
        console.error('Error retrieving sale record:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

  // Delete a sale by ID
  router.delete('/sales/:id', async (req, res) => {
    try {
      const deletedSale = await Sales.findByIdAndDelete(req.params.id);
      if (!deletedSale) return res.status(404).json({ message: 'Sale not found' });
      res.json({ message: 'Sale deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router;