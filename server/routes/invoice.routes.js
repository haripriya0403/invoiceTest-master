const express = require('express');
const router = express.Router();
const conn = require('../config/db');

// Create an Invoice (Already implemented)
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

    res.status(201).json({
      message: 'Invoice added successfully',
      invoiceId: result.insertId // Return the inserted invoice ID
    });
  });
});

// GET all invoices
router.get('/all', (req, res) => {
  const query = 'SELECT * FROM invoiceTable';

  conn.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching invoices:", err);
      return res.status(500).json({ message: "Failed to retrieve invoices." });
    }

    res.status(200).json(results); // Send all invoices
  });
});

// GET invoice by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM invoiceTable WHERE invoiceid = ?';

  conn.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching invoice by ID:", err);
      return res.status(500).json({ message: "Failed to retrieve invoice." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    res.status(200).json(results[0]); // Send the specific invoice
  });
});

// UPDATE invoice by ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, address, grandTotal, items } = req.body;

  if (!name || !address || !grandTotal || !items) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = `UPDATE invoiceTable
                 SET name = ?, address = ?, grandTotal = ?, items = ?
                 WHERE invoiceid = ?`;

  conn.query(query, [name, address, grandTotal, JSON.stringify(items), id], (err, result) => {
    if (err) {
      console.error("Error updating invoice:", err);
      return res.status(500).json({ message: "Failed to update invoice." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    res.status(200).json({ message: 'Invoice updated successfully' });
  });
});

module.exports = router;
