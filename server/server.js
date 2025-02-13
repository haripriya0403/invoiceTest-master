const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const conn = require("./config/db");
const invoiceRoutes = require("./routes/invoice.routes"); // Import the routes
const cors = require('cors');

dotenv.config();
const app = express();

// Set up CORS with specific configurations
app.use(cors({
  origin: 'http://localhost:4200', // Allow only the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  preflightContinue: false,
  optionsSuccessStatus: 200, // Return 200 for preflight requests
}));

app.use(express.json());
app.use(morgan("dev"));

// Use the invoice routes

const PORT = process.env.PORT;


// Test MySQL connection and start the server
conn.query("SELECT 1").then(() => {
  console.log("MySQL DB connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    app.use("/api/invoice", invoiceRoutes); // All routes will be prefixed with /api/invoices

  });
}).catch((err) => {
  console.error("Database connection failed", err);
  process.exit(1); // Exit if DB connection fails
});
// USE invoice;

// CREATE TABLE `invoiceTable` (
//     `invoiceid` INT AUTO_INCREMENT PRIMARY KEY,
//     `date` DATE ,  
//     `name` VARCHAR(255) NOT NULL,
//     `address` TEXT NOT NULL,
//     `grandTotal` DECIMAL(10, 2) NOT NULL,
//     `items` JSON NOT NULL
// );
