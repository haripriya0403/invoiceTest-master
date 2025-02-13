const express = require('express');
const router = express.Router();
const conn = require('../config/db');

// Create an Invoice
router.post('/add', (req, res) => {
  const { name, address, grandTotal, items } = req.body;

  if (!name || !address || !grandTotal || !items) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = `INSERT INTO invoiceTable (name, address, grandTotal, items)
                 VALUES (?, ?, ?, ?)`;

  conn.query(query, [name, address, grandTotal, JSON.stringify(items)], (err, result) => {
    if (err) {
      console.error("Error inserting invoice:", err);
      return res.status(500).json({ message: "Failed to add invoice." });
    }

    // Send the correct response with the invoiceId
    res.status(201).json({
      message: 'Invoice added successfully',
      invoiceId: result.insertId // Return the inserted invoice ID
    });
  });
});

module.exports = router;
