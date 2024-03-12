const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  imageIndex: {
    type: Number,
    required: true,
  },
  cards: {
    type: [String],
    required: true,
  },
});

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    deckId: {
      type: String,
      required: true,
    },
    players: {
      type: [playerSchema],
      required: true,
    },
    gameState: {
      type: String,
    },
  },
  { versionKey: false }
);

module.exports.Room = mongoose.model("Room", roomSchema);
