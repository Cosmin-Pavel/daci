import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PlayersNav from "../components/PlayersNav";
import Table from "../components/Table";
import Cards from "../components/Cards";
import axios from "axios";
import { GameState, Room } from "../types/types";
import { useSocketContext } from "../state/SocketContext";

interface GameRoomProps {
  images: string[];
}

interface GameStateEvent {
  gameState: GameState
}

const GameRoom: React.FC<GameRoomProps> = ({ images }: GameRoomProps) => {
  const location = useLocation();
  const roomData: Room = {roomId: location.state.roomId, players:location.state.players}
  const username: string = location.state.username; 
  const [ready, setReady] = useState<boolean>(false);
  const [gameState,setGameState] = useState<GameState>("seeCards")


  const {socket} = useSocketContext();

  socket.on("gameStateChange",(arg: GameStateEvent)=>{
  setGameState(arg.gameState)
  })

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
      {roomData.players && <PlayersNav players={roomData.players} images={images} gameState={gameState}/>}
      {roomData.roomId && <Table roomId={roomData.roomId} username={username} gameState={gameState}/>}
      {ready ? (
        roomData.roomId && <Cards username={username} roomId={roomData.roomId} gameState={gameState}/>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GameRoom;
