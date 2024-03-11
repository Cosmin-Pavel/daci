import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PlayersNav from "../components/PlayersNav";
import Table from "../components/Table";
import Cards from "../components/Cards";
import axios from "axios";
import { Room } from "../types/types";

interface GameRoomProps {
  images: string[];
}

const GameRoom: React.FC<GameRoomProps> = ({ images }: GameRoomProps) => {
  const location = useLocation();
  const roomData: Room = {roomId: location.state.roomId, playersArray:location.state.playersArray}
  const username: string = location.state.username; 
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      await axios.post("http://localhost:2000/api/initializeGame", { roomId: roomData.roomId });
    };
    fetchData().then(() => {
      setReady(true);
    });
  }, [roomData.roomId]);

  return (
    <div>
      {roomData.playersArray && <PlayersNav playersArray={roomData.playersArray} images={images} />}
      <Table />
      {ready ? (
        roomData.roomId && <Cards username={username} roomId={roomData.roomId} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GameRoom;
