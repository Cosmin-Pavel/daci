import React, { useEffect, useState } from "react";
import { cardDictionary } from "../utils/cardDictionary";
import { useDrag } from "react-dnd";
import { CardsChangedEvent, GameState } from "../types/types";
import { useSocketContext } from "../state/SocketContext";

interface CardProps {
  playerCards: string[];
  index: number;
  handleCardClick: () => void;
  cardsVisible: number;
  gameState: GameState;
  isDrawn: boolean;
}

const Card = ({
  playerCards,
  index,
  handleCardClick,
  cardsVisible,
  gameState,
  isDrawn,
}: CardProps) => {
  const [canBeVisible, setCanBeVisible] = useState(isDrawn);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "card",
    item: { card: playerCards[index] },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const [imageSrc, setImageSrc] = useState("/blue.svg");

  const showCard = () => {
    handleCardClick();
    if (cardsVisible < 2 && gameState === "seeCards") {
      const card = playerCards[index];
      setImageSrc(`/svg_playing_cards/fronts/${cardDictionary[card]}`);
      setTimeout(() => {
        setImageSrc("/blue.svg");
      }, 3000);
    }
  };

  useEffect(() => {
    if (canBeVisible) {
      const card = playerCards[index];
      setImageSrc(`/svg_playing_cards/fronts/${cardDictionary[card]}`);
      setTimeout(() => {
        setImageSrc("/blue.svg");
      }, 3000);
      setCanBeVisible(false);
    }
  }, [index, isDrawn, playerCards]);

  return (
    <img
      ref={drag}
      onClick={showCard}
      className=" w-11 h-auto"
      src={imageSrc}
      alt="back of the card"
      key={playerCards[index]}
      style={{ border: isDragging ? "5px solid pink" : "0px" }}
    />
  );
};

export default Card;
