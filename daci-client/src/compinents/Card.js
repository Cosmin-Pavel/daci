import React, { useState } from "react";
import { cardDictionary } from "../utils/cardDictionary";

const Card = ({ playerCards, index, handleCardClick, cardsVisible }) => {
  const [imageSrc, setImageSrc] = useState("/blue.svg");

  const showCard = () => {
    console.log(cardsVisible);
    handleCardClick();
    if (cardsVisible < 2) {
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
