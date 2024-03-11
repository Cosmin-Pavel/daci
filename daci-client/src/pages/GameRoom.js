import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PlayersNav from "../compinents/PlayersNav";
import Table from "../compinents/Table";
import Cards from "../compinents/Cards";
import axios from "axios";

const GameRoom = ({ images }) => {
  const location = useLocation();
  const roomId = location.state.roomId;
  const playersArray = location.state.playersArray;
  const username = location.state.username;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await axios.post("http://localhost:2000/api/initializeGame", { roomId });
    };
    fetchData().then(() => {
      setReady(true);
    });
  }, [roomId]);

  return (
    <div>
      <PlayersNav playersArray={playersArray} images={images} />
      <Table />
      {ready ? (
        <Cards username={username} roomId={roomId} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GameRoom;
