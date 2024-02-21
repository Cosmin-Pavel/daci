const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  id: {
    required: true,
    type: String,
  },
  players: {
    required: true,
    type: Array,
  },
});

module.exports = mongoose.model("Data", dataSchema);
