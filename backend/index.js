// Import Express
const express = require('express');
const app = express();

// Set a port
const PORT = 3000;

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
