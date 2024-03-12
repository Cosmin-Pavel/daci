"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const { Room } = require("./models/model");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const { join } = require("path");
const axios = require("axios");
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
    socket.on("userDisconnected", async (data) => {
        const { roomId, username } = data;
        try {
            const updatedRoom = await Room.findOneAndUpdate({ roomId: roomId }, { $pull: { players: { username: username } } }, { new: true });
            io.emit("usersChanged", updatedRoom.players);
            if (!updatedRoom) {
                console.log("User not found in room");
            }
        }
        catch (error) {
            console.error("Error deleting user from room:", error);
        }
    });
    socket.on("startTheGame", (data) => {
        io.to(data.roomId).emit("gameStarted");
    });
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
    });
    // Handle events here
    socket.on("disconnect", () => { });
});
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
    console.log(data);
    try {
        const dataToSave = await data.save();
        return res.status(200).json(dataToSave);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
app.post("/api/playersArray", async (req, res) => {
    const { roomId } = req.body;
    try {
        const room = await Room.findOne({ roomId: roomId });
        if (!room)
            return res.status(404).json({ message: "Room not found" });
        return res.status(200).json(room.players);
    }
    catch (error) {
        console.error("Error adding user to room:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
app.post("/api/addToRoom", async (req, res) => {
    const { roomId, userData } = req.body;
    try {
        const room = await Room.findOne({ roomId: roomId });
        if (!room)
            return res.status(404).json({ message: "Room not found" });
        const newPlayer = {
            username: userData.username,
            imageIndex: userData.imageIndex,
            cards: [],
        };
        room.players.push(newPlayer);
        await room.save();
        res.status(200).json({ message: "User added succesfully" });
        io.emit("usersChanged", { players: room.players, roomId: roomId }); //#TODO: handle not emitting to everyone
    }
    catch (error) {
        console.error("Error adding user to room:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
function generateRoomID() {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    return timestamp;
}
app.get("/api/getCards", async (req, res) => {
    const { username, roomId } = req.query;
    try {
        let cards = [];
        const room = await Room.findOne({ roomId: roomId });
        if (!room)
            return res.status(404).json({ message: "Room not found" });
        const drawPromises = room.players.map((player) => {
            if (player.username === username)
                cards = player.cards;
        });
        await Promise.all(drawPromises);
        return res.status(200).json(cards);
    }
    catch (error) {
        console.error("Error drawing cards:", error);
        res.status(500).json({ message: "Error drawing cards" });
    }
});
app.post("/api/drawACard", async (req, res) => {
    const roomId = req.body.roomId;
    const username = req.body.username;
    try {
        const room = await Room.findOne({ roomId: roomId });
        if (!room)
            return res.status(404).json({ message: "Room not found" });
        const deckId = room.deckId;
        console.log(deckId);
        const response = await axios.get(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        room.players.forEach((element) => {
            if (element.username == username) {
                element.cards.push(response.data.cards[0].code);
                console.log(response.data.cards);
            }
        });
        io.to(roomId).emit("cardsChanged", { username: username, card: response.data.cards[0].code });
        res.status(200).json({ cardCode: response.data.cards[0].code });
    }
    catch (error) {
        console.error("Error drawing a card:", error);
        res.status(500).json({ message: "Error drawing a card" });
    }
});
app.post("/api/initializeGame", async (req, res) => {
    const { roomId } = req.body;
    try {
        const response = await axios.get("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
        const deckId = response.data.deck_id;
        try {
            const room = await Room.findOne({ roomId: roomId });
            if (!room)
                return res.status(404).json({ message: "Room not found" });
            room.deckId = deckId;
            room.gameState = "seeCards";
            // Draw cards for each player
            const drawPromises = room.players.map(async (player) => {
                try {
                    const response = await axios.get(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`);
                    const cardCodes = response.data.cards.map((card) => card.code);
                    player.cards = cardCodes;
                }
                catch (error) {
                    console.error("Error drawing cards:", error);
                    res.status(500).json({ message: "Error drawing cards" });
                }
            });
            // Wait for all draw operations to complete
            await Promise.all(drawPromises);
            // Save room with updated player cards
            await room.save();
            res.status(200).json({
                message: "Game initialized successfully",
                playersArray: room.players,
            });
        }
        catch (error) {
            console.error("Error initializing deck:", error);
            res.status(500).json({ message: "Error initializing deck" });
        }
    }
    catch (error) {
        console.error("Error initializing game:", error);
        res.status(500).json({ error: "Failed to initialize game" });
    }
});
//# sourceMappingURL=server.js.map