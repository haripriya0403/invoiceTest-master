const mysql = require('mysql2');

// create the connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'1234',
  database: 'invoice',
});

// Use the promise-based version of the connection pool
module.exports = conn.promise();
