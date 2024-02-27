const mongoose = require("mongoose");

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
  players: {
    required: true,
    type: Array,
  },
});

module.exports.Room = mongoose.model("Room", roomSchema);
