import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";

interface CardsProps {
  username:string
  roomId:string

}

const Cards = ({ username, roomId }:CardsProps) => {
  const [playerCards, setPlayerCards] = useState([]);
  let [cardsVisible, setCardsVisible] = useState(0);

  const handleCardClick = () => {
    if (cardsVisible < 2) {
      setCardsVisible(cardsVisible + 1);
    }
  };

  const getPlayerCards = useCallback(async () => {
    await axios
      .get(
        `http://localhost:2000/api/getCards?username=${username}&roomId=${roomId}`
      )
      .then((response) => {
        setPlayerCards(response.data);
      });
  }, [roomId, username]);
  console.log(playerCards);
  useEffect(() => {
    getPlayerCards();
  }, [getPlayerCards, roomId, username]);

  return (
    <div>
      <div className="flex gap-4  justify-between ml-3 mr-3  max-w-xs  flex-wrap">
        {playerCards.map((_, index) => (
          <div key={playerCards[index]}>
            <Card
              playerCards={playerCards}
              index={index}
              handleCardClick={handleCardClick}
              cardsVisible={cardsVisible}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
