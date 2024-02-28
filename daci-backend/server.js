require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const { join } = require("path");
const routes = require("./routes/routes");

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Connect to MongoDB database
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

// Log database connection status
database.on("error", (error) => {
  console.log(error);
});
database.once("connected", () => {
  console.log("Database Connected");
});

// Configure routes for API endpoints
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", routes);

// Serve static files (if needed)
app.use(express.static(join(__dirname, "public")));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"], // Adjust methods as needed
  },
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("a user connected");

  // Handle events here
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Start the combined server
const PORT = process.env.PORT || 2000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
