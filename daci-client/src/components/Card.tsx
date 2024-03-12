import React, { useState } from "react";
import { cardDictionary } from "../utils/cardDictionary";

interface CardProps{
  playerCards:string[]
  index:number
  handleCardClick: () => void;
  cardsVisible:number
  gameState:string
}

const Card = ({ playerCards, index, handleCardClick, cardsVisible,gameState}:CardProps) => {
  const [imageSrc, setImageSrc] = useState("/blue.svg");

  const showCard = () => {
    console.log(cardsVisible);
    handleCardClick();
    if (cardsVisible < 2 && gameState === "seeCards") {
      const card = playerCards[index];
      setImageSrc(`/svg_playing_cards/fronts/${cardDictionary[card]}`);
      setTimeout(() => {
        setImageSrc("/blue.svg");
      }, 3000);
    }
  };

  return (
    <img
      onClick={showCard}
      className=" w-11 h-auto"
      src={imageSrc}
      alt="back of the card"
      key={index}
    />
  );
};

export default Card;
