import { useEffect, useState } from "react";
import { GameState, Player } from "../types/types";
import axios from "axios";
import Card from "./Card";

interface PlayersNavProps {
  roomId?: any;
  players: Player[];
  images: string[];
  gameState?: GameState;
  qAction?: boolean;
  setQAction?: (value: boolean) => void;
  qNumber?: number;
  setQNumber?: (value: number) => void;
}

const PlayersNav = ({
  roomId,
  players,
  images,
  gameState,
  qAction,
  setQAction,
  qNumber,
  setQNumber,
}: PlayersNavProps) => {
  const [showModal, setShowModal] = useState(false);
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const playerModal = async (player: Player) => {
    if (qAction) {
      await axios
        .get(
          `http://localhost:2000/api/getCards?username=${player.username}&roomId=${roomId}`
        )
        .then((response) => {
          setPlayerCards(response.data);
        });
    }
  };

  useEffect(() => {
    console.log("Updated playerCards:", playerCards);
    setShowModal(true);
  }, [playerCards]);

  return (
    <nav className="w-full flex gap-7 p-4 overflow-x-scroll border-b-2">
      {players &&
        players.length > 0 &&
        players.map((player, index) => (
          <div className="flex-col min-w-12 min-h-12" key={index}>
            <div
              className={`w-12 h-12 flex items-center justify-center ${
                gameState === player.username ? "bg-red-900" : "bg-purple-500"
              }`}
            >
              <img
                src={images[player.imageIndex]}
                alt="character"
                className="w-full h-full rounded-full object-cover"
                onClick={() => playerModal(player)}
              />
            </div>
            <p className="text-center font-inter text-xs font-normal leading-4">
              {player.username}
            </p>
          </div>
        ))}
      <div>
        {qAction &&
          setQAction &&
          showModal &&
          playerCards.map((_, index) => (
            <div key={playerCards[index]}>
              <Card
                gameState={gameState}
                playerCards={playerCards}
                index={index}
                qAction={qAction}
                setQAction={setQAction}
                qNumber={qNumber}
                setQNumber={setQNumber}
              />
            </div>
          ))}
      </div>
    </nav>
  );
};

export default PlayersNav;
