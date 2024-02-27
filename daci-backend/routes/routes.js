const express = require("express");
const Model = require("../models/model");

const router = express.Router();

//Post Method
router.post("/post", async (req, res) => {
  console.log(req.body);
  const data = new Model({
    id: req.body.id,
    players: req.body.players,
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/create-room", async (req, res) => {
  const data = new Model({
    roomId: generateRoomID(),
    creatorUsername: req.body.userData.username,
    creatorImageIndex: req.body.userData.imageIndex,
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
    res = data.roomId;
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

function generateRoomID() {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  return timestamp;
}

//Get all Method
router.get("/getAll", (req, res) => {
  res.send("Get All API");
});

//Get by ID Method
router.get("/getOne/:id", (req, res) => {
  res.send("Get by ID API");
});

//Update by ID Method
router.patch("/update/:id", (req, res) => {
  res.send("Update by ID API");
});

//Delete by ID Method
router.delete("/delete/:id", (req, res) => {
  res.send("Delete by ID API");
});

module.exports = router;
