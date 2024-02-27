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

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  creatorUsername: {
    type: String,
    required: true,
  },
  creatorImageIndex: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Data", dataSchema);
module.exports = mongoose.model("Room", roomSchema);
