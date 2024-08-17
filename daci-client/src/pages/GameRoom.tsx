import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const roomData: Room = {
    roomId: location.state.roomId,
    players: location.state.players,
  };
  const username: string = location.state.username;
  const [ready, setReady] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>("seeCards");
  const [lastTurn, setLastTurn] = useState<boolean>(false);
  const [instructions, setInstructions] = useState<string>(
    "Click on 2 cards to reveal them."
  );
  const [daciPlayer, setDaciPlayer] = useState<string>();
  const [endGame, setEndGame] = useState<boolean>(false);

  const { socket } = useSocketContext();

  socket.on("cardsChanged", (arg: CardsChangedEvent) => {
    if (arg.username === username) {
      setInstructions("Drag and drop a card to get rid of it");
    }
  });

  socket.on("daci", (daciArray: string[]) => {
    if (roomData.players && roomData.players?.length > 0) {
      setDaciPlayer(daciArray[daciArray.length - 1]);
    }
  });
  useEffect(() => {
    const handleEndGameServer = () => {
      setEndGame(true);
    };
    socket.on("endGameServer", handleEndGameServer);
    return () => {
      socket.off("endGameServer", handleEndGameServer);
    };
  }, [socket]);

  useEffect(() => {
    const handleGameStateChange = (arg: GameStateEvent) => {
      setGameState(arg.gameState);

      if (username === arg.gameState)
        setInstructions("Click on the deck to draw a card");
      else setInstructions("");
      if (username === daciPlayer) {
        setLastTurn(true);
      }
      if (lastTurn && username === daciPlayer) {
        socket.emit("endGame", {
          roomId: roomData.roomId,
          daciPlayer: daciPlayer,
        });
      }
    };

    socket.on("gameStateChange", handleGameStateChange);
    return () => {
      console.log("Cleaning up gameStateChange listener");
      socket.off("gameStateChange", handleGameStateChange);
    };
  }, [daciPlayer, lastTurn, roomData.roomId, socket, username]);

  useEffect(() => {
    axios
      .post("http://localhost:2000/api/initializeGame", {
        roomId: roomData.roomId,
        username: username,
      })
      .then(() => {
        setReady(true);
      });
  }, [roomData.roomId, username]);

  useEffect(() => {
    if (endGame) {
      navigate("/EndGameScreen", { state: { roomId: roomData.roomId } });
    }
  }, [endGame, navigate]);

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
