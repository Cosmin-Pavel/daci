const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint for the initial route
app.get("/", (req, res) => {
  res.send("Welcome to the home page!!");
});

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Catch-all route for handling unknown routes
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
