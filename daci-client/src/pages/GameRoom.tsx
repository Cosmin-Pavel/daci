import { useLocation } from "react-router-dom";
import PlayersNav from "../components/PlayersNav";
import Table from "../components/Table";
import Cards from "../components/Cards";
import axios from "axios";
import {
  CardsChangedEvent,
  GameState,
  GameStateEvent,
  Room,
} from "../types/types";
import { useSocketContext } from "../state/SocketContext";
import { useEffect, useState } from "react";

interface GameRoomProps {
  images: string[];
}

const GameRoom: React.FC<GameRoomProps> = ({ images }: GameRoomProps) => {
  const location = useLocation();
  const roomData: Room = {
    roomId: location.state.roomId,
    players: location.state.players,
  };
  const username: string = location.state.username;
  const [ready, setReady] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>("seeCards");
  const [instructions, setInstructions] = useState<string>(
    "Click on 2 cards to reveal them."
  );

  const { socket } = useSocketContext();

  socket.on("gameStateChange", (arg: GameStateEvent) => {
    setGameState(arg.gameState);
    if (username === arg.gameState)
      setInstructions("Click on the deck to draw a card");
    else setInstructions("");
  });

  socket.on("cardsChanged", (arg: CardsChangedEvent) => {
    if (arg.username === username) {
      setInstructions("Drag and drop a card to get rid of it");
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      await axios.post("http://localhost:2000/api/initializeGame", {
        roomId: roomData.roomId,
      });
    };
    fetchData().then(() => {
      setReady(true);
    });
  }, [roomData.roomId]);

  return (
    <div>
      {roomData.players && (
        <PlayersNav
          players={roomData.players}
          images={images}
          gameState={gameState}
        />
      )}
      {instructions && <p>{instructions}</p>}
      {roomData.roomId && (
        <Table
          roomId={roomData.roomId}
          username={username}
          gameState={gameState}
        />
      )}
      {ready ? (
        roomData.roomId && (
          <Cards
            username={username}
            roomId={roomData.roomId}
            gameState={gameState}
          />
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GameRoom;
