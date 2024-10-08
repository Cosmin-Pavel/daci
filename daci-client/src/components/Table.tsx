import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import { cardDictionary } from "../utils/cardDictionary";
import { useSocketContext } from "../state/SocketContext";
import { GameStateEvent, PlayerCard } from "../types/types";
interface TableProps {
  roomId: string;
  username: string;
  gameState: string;
}

interface CardType {
  card: string;
}

const Table = ({ roomId, username, gameState }: TableProps) => {
  const { socket } = useSocketContext();

  const [downCard, setDownCard] = useState("/blue.svg");
  const [canClick, setCanClick] = useState(true);
  const [canDrop, setCanDrop] = useState(false);
  const [daci, setDaci] = useState("");
  const [{ isOver }, drop] = useDrop(
    useMemo(
      () => ({
        accept: "card",
        drop: (item: CardType): undefined => {
          if (canDrop || checkIfSameCard(downCard, item.card)) {
            setDownCard(item.card);
            socket.emit("downCardChanged", {
              card: item.card,
              username: username,
              roomId: roomId,
            });
            console.log(item.card);
            setCanDrop(false);
          }
          return undefined;
        },
        // canDrop: () => canDrop,
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      }),
      [canDrop, downCard, roomId, socket, username]
    )
  );

  const checkIfSameCard = (card1: string, card2: string) => {
    if (card1 && card2 && card1.charAt(0) === card2.charAt(0)) {
      return true;
    }
    return false;
  };

  const drawACard = async () => {
    if (gameState === username && canClick) {
      setCanClick(false);
      setCanDrop(true);
      await axios.post("http://localhost:2000/api/drawACard", {
        roomId,
        username,
      });
    }
  };

  useEffect(() => {
    console.log(canDrop);
  }, [canDrop]);

  socket.on("gameStateChange", (arg: GameStateEvent) => {
    arg.gameState === username && setCanClick(true);
  });

  socket.on("downCardChange", (arg: PlayerCard) => {
    setDownCard(arg.card);
  });

  socket.on("daci", (username: string) => {
    setDaci(username);
  });

  const daciPressed = () => {
    setDaci(username);
    socket.emit("daciPressed", { username: username, roomId: roomId });
  };

  return (
    <>
      <div className="flex justify-between ml-9 mr-9 mt-20 mb-20">
        <div ref={drop} className="w-32 h-44 bg-slate-600">
          <img
            src={`/svg_playing_cards/fronts/${cardDictionary[downCard]}`}
            alt="card-down"
          />
        </div>
        <img src="Deck.svg" alt="deck" onClick={drawACard} />
      </div>
      <button className=" bg-slate-600 h-5 " onClick={daciPressed}>
        Daci!
      </button>
      {daci && <p>Daci was pressed!</p>}
    </>
  );
};

export default Table;
