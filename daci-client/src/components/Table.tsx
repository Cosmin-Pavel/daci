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
  setQAction: (value: boolean) => void;
  qNumber: number;
  setQNumber: (value: number) => void;
}

interface CardType {
  card: string;
}

const Table = ({
  roomId,
  username,
  gameState,
  setQAction,
  qNumber,
  setQNumber,
}: TableProps) => {
  const checkIfQ = (card: string) => {
    if (card.charAt(0) === "Q") {
      setQAction(true);
      setQNumber(qNumber + 1);
    }
  };
  const { socket } = useSocketContext();
  const [downCard, setDownCard] = useState("/blue.svg");
  const [canClick, setCanClick] = useState(true);
  const [canDrop, setCanDrop] = useState(false);
  const [daci, setDaci] = useState("");
  const [canPressDaci, setCanPressDaci] = useState(false);
  const [canPressRetract, setCanPressRetract] = useState(false);
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
            checkIfQ(item.card);
            setCanDrop(false);
            setCanPressDaci(true);
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

  socket.on("gameStateChange", (arg: GameStateEvent) => {
    arg.gameState === username && setCanClick(true);
    setCanPressDaci(false);
    setCanPressRetract(false);
    setCanDrop(false);
  });

  socket.on("downCardChange", (arg: PlayerCard) => {
    setDownCard(arg.card);
  });

  socket.on("daci", (daciArray: string[]) => {
    setDaci(daciArray[daciArray.length - 1]);
    console.log(daciArray);

    const usernameIndex = daciArray.indexOf(username);

    if (usernameIndex !== -1 && usernameIndex === daciArray.length - 2)
      setCanPressRetract(true);
  });

  const daciPressed = () => {
    if (canPressDaci) {
      setDaci(username);
      socket.emit("daciPressed", { username: username, roomId: roomId });
    }
  };
  const retractPressed = () => {
    if (canPressRetract) {
      setCanPressRetract(false);
      socket.emit("retractPressed", { username: username, roomId: roomId });
    }
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
      {!canPressRetract && (
        <button
          className={`h-5 ${canPressDaci ? "bg-blue-600" : "bg-gray-600"}`}
          onClick={daciPressed}
          disabled={!canPressDaci}
        >
          {daci && daci !== username ? "Double Daci" : "Daci!"}
        </button>
      )}
      {canPressRetract && (
        <button
          className={`h-5 ${canPressRetract ? "bg-blue-600" : "bg-gray-600"}`}
          onClick={retractPressed}
          disabled={!canPressRetract}
        >
          {"Retract!"}
        </button>
      )}
      {daci && <p>Daci was pressed by {daci}!</p>}
    </>
  );
};

export default Table;
