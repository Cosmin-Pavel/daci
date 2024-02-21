require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;
const routes = require("./routes/routes");
const bodyParser = require("body-parser");

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(bodyParser());
app.use("/api", routes);

// Endpoint for the initial route
app.get("/", (req, res) => {
  res.send("Welcome to the home page!!");
});

app.post("/create-room", async (req, res) => {
  let collection = await db.collection("sessions");
  let results = await collection.find({}).limit(50).toArray();
  res.send(results).status(200);
  console.log(results);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
