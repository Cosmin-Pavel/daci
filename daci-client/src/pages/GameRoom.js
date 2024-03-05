import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PlayersNav from "../compinents/PlayersNav";
import Table from "../compinents/Table";
import Cards from "../compinents/Cards";
import axios from "axios";

const GameRoom = ({ images }) => {
  const location = useLocation();
  const roomId = location.state.roomId;
  const playersArray = location.state.playersArray;
  console.log(playersArray);

  async function getData() {
    await axios.post("http://localhost:2000/api/initializeGame", { roomId });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <PlayersNav playersArray={playersArray} images={images} />
      <Table />
      <Cards />
    </div>
  );
};

export default GameRoom;
