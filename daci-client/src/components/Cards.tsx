import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import { useSocketContext } from "../state/SocketContext";




interface CardsProps {
  username:string
  roomId:string
  gameState:string

}
interface CardsChangedEvent{
  username:string
  card:string
}

const Cards = ({ username, roomId, gameState }:CardsProps) => {
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  let [cardsVisible, setCardsVisible] = useState(0);

  const {socket} = useSocketContext();

  const handleCardClick = () => {
    if (cardsVisible < 2) {
      setCardsVisible(cardsVisible + 1);
    }
  };


  socket.on("cardsChanged", (arg:CardsChangedEvent) => {
    if(arg.username===username){
      
      setPlayerCards([...playerCards, arg.card])
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
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
