import { Socket } from "socket.io";

require("dotenv").config();
const { Room } = require("./models/model");
import { Express, Request, Response } from "express";
import express = require("express");
import { Document } from "mongodb";
import { captureRejectionSymbol } from "events";
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const { join } = require("path");
const axios = require("axios");
const cron = require("node-cron");
// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Connect to MongoDB database
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

// Log database connection status
database.on("error", (error: string) => {
  console.log(error);
});
database.once("connected", () => {
  console.log("Database Connected");
});

// Configure routes for API endpoints
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

interface userDisconnectedData {
  roomId: string;
  username: string;
}

interface PlayerInterface {
  username: string;
  imageIndex: number;
  cards: string[];
}

interface RoomInterface extends Document {
  roomId: string;
  deckId: string;
  players: PlayerInterface[];
  gameState: string;
  intervalId?: number;
}

// Handle WebSocket connections
io.on("connection", (socket: Socket) => {
  socket.on("userDisconnected", async (data: userDisconnectedData) => {
    const { roomId, username } = data;
    try {
      const updatedRoom = await Room.findOneAndUpdate(
        { roomId: roomId },
        { $pull: { players: { username: username } } },
        { new: true }
      );
      io.emit("usersChanged", updatedRoom.players);
      if (!updatedRoom) {
        console.log("User not found in room");
      }
    } catch (error) {
      console.error("Error deleting user from room:", error);
    }
  });

  socket.on("startTheGame", (data) => {
    io.to(data.roomId).emit("gameStarted");
  });

  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
  });

  socket.on("daciPressed", async (data) => {
    try {
      const updatedRoom = await Room.findOneAndUpdate(
        { roomId: data.roomId },
        { $push: { daciArray: data.username } },
        { new: true }
      );
      if (updatedRoom) {
        io.to(data.roomId).emit("daci", updatedRoom.daciArray);
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("downCardChanged", async (data) => {
    const roomId = data.roomId;
    const username = data.username;
    const card = data.card;
    io.to(roomId).emit("downCardChange", {
      card: data.card,
      username: username,
    });

    try {
      const updatedRoom = await Room.findOneAndUpdate(
        { roomId: roomId, "players.username": username }, // Find the room with given roomId and player with given username
        { $pull: { "players.$.cards": card } }, // Remove the specified card from the cards array of the matched player
        { new: true } // Return the updated document
      );

      if (!updatedRoom) {
        // Handle case where room or player was not found
        console.log("Room or player not found.");
      } else {
        console.log("Room updated successfully:");
      }
    } catch (error) {
      // Handle error
      console.error("Error updating room:", error);
    }
  });

  socket.on("endGame", async ({ roomId: roomId, daciPlayer: daciPlayer }) => {
    try {
      const updatedRoom = await Room.findOneAndUpdate(
        { roomId: roomId },
        { $set: { intervalId: 0 } },
        { new: true }
      );
      console.log("intervalId set to 0 for roomId:", roomId);
    } catch (error) {
      console.error("Error updating intervalId to 0 in database:", error);
    }
    try {
      const room = await Room.findOne({ roomId: roomId });
    } catch (error) {
      console.error("error finding room when calculating the scores: ", error);
    }
    io.to(roomId).emit("endGameServer");

    try {
      const room = await Room.findOne({ roomId: roomId });
    } catch (error) {
      console.error("Error finding endgame room:", error);
    }
  });

  socket.on(
    "retractPressed",
    async ({ username: username, roomId: roomId }) => {
      try {
        const updatedRoom = await Room.findOneAndUpdate(
          { roomId: roomId },
          { $pull: { daciArray: username } },
          { new: true } // This option returns the updated document
        );
      } catch (error) {
        console.error("error updating room when retracting player ", error);
      }
    }
  );

  // Handle events here
  socket.on("disconnect", () => {});
});

const calculateScores = (room: RoomInterface) => {
  const cardMap: { [key: string]: number } = {
    A: 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "0": 10,
    J: 10,
    Q: 10,
    K: 10,
  };

  const scores: { [username: string]: number } = {};
  room.players.forEach((player) => {
    let totalScore = 0;
    player.cards.forEach((card) => {
      if (card !== "KH" && card !== "KD") {
        const cardValue = card.slice(0, -1);
        totalScore = totalScore + cardMap[cardValue];
      }
    });
    scores[player.username] = totalScore;
    let minscore = 10;
    let minplayer;
    room.daciArray.forEach((player: string) => {
      if (scores[player] < minscore) {
        minscore = scores[player];
        minplayer = player;
      }
    });
    room.daciArray.forEach((player: string) => {
      if (scores[player] > minscore || scores[player] > 9) scores[player] = 50;
      if (scores[player] === minscore && scores[player] < 9) scores[player] = 0;
    });
  });
  return scores;
};

// Start the combined server
const PORT = process.env.PORT || 2000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post("/api/create-room", async (req, res) => {
  const newPlayer = {
    username: req.body.userData.username,
    imageIndex: req.body.userData.imageIndex,
    cards: [],
  };
  const data = new Room({
    roomId: generateRoomID(),
    players: [newPlayer],
    deckId: "0",
    gameState: "",
  });
  try {
    const dataToSave = await data.save();
    return res.status(200).json(dataToSave);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
});

app.post("/api/playersArray", async (req, res) => {
  const { roomId } = req.body;
  try {
    const room = await Room.findOne({ roomId: roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });
    return res.status(200).json(room.players);
  } catch (error) {
    console.error("Error adding user to room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/addToRoom", async (req, res) => {
  const { roomId, userData } = req.body;
  try {
    const room = await Room.findOne({ roomId: roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });
    const newPlayer = {
      username: userData.username,
      imageIndex: userData.imageIndex,
      cards: [],
    };
    room.players.push(newPlayer);
    await room.save();
    res.status(200).json({ message: "User added succesfully" });

    io.emit("usersChanged", { players: room.players, roomId: roomId }); //#TODO: handle not emitting to everyone
  } catch (error) {
    console.error("Error adding user to room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

function generateRoomID() {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  return timestamp;
}

interface Player {
  username: string;
  imageIndex: number;
  cards: string[];
}

app.get("/api/getCards", async (req, res) => {
  const { username, roomId } = req.query;
  try {
    let cards: string[] = [];
    const room = await Room.findOne({ roomId: roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });
    const drawPromises = room.players.map((player: Player) => {
      if (player.username === username) cards = player.cards;
    });
    await Promise.all(drawPromises);
    return res.status(200).json(cards);
  } catch (error) {
    console.error("Error drawing cards:", error);
    res.status(500).json({ message: "Error drawing cards" });
  }
});

app.get("/api/getScores", async (req: Request, res: Response) => {
  let scores;
  const roomId = req.query.roomId as string;
  const room: RoomInterface = await Room.findOne({ roomId: roomId });
  if (!room) return res.status(404).json({ message: "Room not found" });
  scores = calculateScores(room);
  res.status(200).json({ scores: scores });
});

app.post("/api/drawACard", async (req, res) => {
  const roomId = req.body.roomId;
  const username = req.body.username;
  try {
    const room: RoomInterface = await Room.findOne({ roomId: roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });
    const deckId = room.deckId;

    const response = await axios.get(
      `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
    );
    room.players.forEach((element) => {
      if (element.username === username) {
        element.cards.push(response.data.cards[0].code);
      }
    });
    room.save();
    io.to(roomId).emit("cardsChanged", {
      username: username,
      card: response.data.cards[0].code,
    });
    res.status(200).json({ cardCode: response.data.cards[0].code });
  } catch (error) {
    console.error("Error drawing a card:", error);
    res.status(500).json({ message: "Error drawing a card" });
  }
});

//
async function gameWorker(room: RoomInterface, deckId: string, io: Socket) {
  if (room.intervalId || room.intervalId === 0) {
    console.log("Interval already running for room:", room.roomId);
    return; // Exit if an interval is already running
  }

  console.log("Starting gameWorker for room:", room.roomId);

  let index = 0;
  const intervalId = setInterval(async () => {
    // Fetch the latest room data from the database
    const latestRoom = await Room.findOne({ roomId: room.roomId });

    if (latestRoom.intervalId === 0) {
      clearInterval(intervalId);
      console.log("gameworker closed for roomId:", room.roomId);
      return;
    }
    if (index < room.players.length) {
      room.gameState = room.players[index].username;
      index++;
      io.to(room.roomId).emit("gameStateChange", { gameState: room.gameState });
      console.log("turn", index, room.intervalId);
    } else {
      index = 0;
    }
  }, 10000);

  try {
    // Store interval ID in the room object and the database
    const intervalIdValue = intervalId[Symbol.toPrimitive]();
    room.intervalId = intervalIdValue;

    const updatedRoom = await Room.findOneAndUpdate(
      { roomId: room.roomId },
      { $set: { intervalId: intervalIdValue } },
      { new: true } // Return the updated document
    );
  } catch (error) {
    console.error("Error updating room with intervalId:", error);
    clearInterval(intervalId); // Clear interval if there's an error updating the database
  }
}

app.post("/api/initializeGame", async (req: Request, res: Response) => {
  const { roomId, username } = req.body;

  try {
    const response = await axios.get(
      "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );

    const deckId: string = response.data.deck_id;

    try {
      const room: RoomInterface | null = await Room.findOne({ roomId: roomId });

      if (!room) return res.status(404).json({ message: "Room not found" });

      room.deckId = deckId;
      room.gameState = "seeCards";

      // Draw cards for each player
      const drawPromises = room.players.map(async (player: Player) => {
        try {
          const response = await axios.get(
            `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`
          );

          const cardCodes = response.data.cards.map((card: any) => card.code);
          player.cards = cardCodes;
        } catch (error) {
          console.error("Error drawing cards:", error);
          res.status(500).json({ message: "Error drawing cards" });
        }
      });
      if (username === room?.players?.[0].username)
        // Start the worker function before drawing cards for the players
        gameWorker(room, deckId, io);
      // Wait for all draw operations to complete
      await Promise.all(drawPromises);

      // Save room with updated player cards
      await room.save();

      res.status(200).json({
        message: "Game initialized successfully",
        playersArray: room.players,
      });
    } catch (error) {
      console.error("Error initializing deck:", error);
      res.status(500).json({ message: "Error initializing deck" });
    }
  } catch (error) {
    console.error("Error initializing game:", error);
    res.status(500).json({ error: "Failed to initialize game" });
  }
});
