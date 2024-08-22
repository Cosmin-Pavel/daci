import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import { useSocketContext } from "../state/SocketContext";
import { CardsChangedEvent, PlayerCard } from "../types/types";

interface CardsProps {
  username: string;
  roomId: string;
  gameState: string;
  qAction: boolean;
  setQAction: (value: boolean) => void;
  qNumber: number;
  setQNumber: (value: number) => void;
}

const Cards = ({
  username,
  roomId,
  gameState,
  qAction,
  setQAction,
  qNumber,
  setQNumber,
}: CardsProps) => {
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [cardsVisible, setCardsVisible] = useState(0);
  const [drawnCard, setDrawnCard] = useState("");

  const { socket } = useSocketContext();

  const handleCardClick = () => {
    if (cardsVisible < 2) {
      setCardsVisible(cardsVisible + 1);
    }
  };

  socket.on("cardsChanged", (arg: CardsChangedEvent) => {
    if (arg.username === username) {
      setPlayerCards([...playerCards, arg.card]);
      setDrawnCard(arg.card);
    }
  });

  socket.on("downCardChange", (arg: PlayerCard) => {
    if (arg.username === username) {
      const newArray = [...playerCards]; // Create a new array based on the current state
      const index = newArray.indexOf(arg.card);

      if (index !== -1) {
        newArray.splice(index, 1); // Modify the new array

        setPlayerCards(newArray); // Update the state with the new array
      }
    }
  });

  const getPlayerCards = useCallback(async () => {
    await axios
      .get(
        `http://localhost:2000/api/getCards?username=${username}&roomId=${roomId}`
      )
      .then((response) => {
        setPlayerCards(response.data);
      });
  }, [roomId, username]);
  useEffect(() => {
    getPlayerCards();
  }, [getPlayerCards, roomId, username]);

  return (
    <div>
      <div className="flex gap-4  justify-between ml-3 mr-3  max-w-xs  flex-wrap">
        {playerCards.map((_, index) => (
          <div key={playerCards[index]}>
            <Card
              gameState={gameState}
              playerCards={playerCards}
              index={index}
              handleCardClick={handleCardClick}
              cardsVisible={cardsVisible}
              isDrawn={playerCards[index] === drawnCard}
              qAction={qAction}
              setQAction={setQAction}
              qNumber={qNumber}
              setQNumber={setQNumber}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
