import React, { useState, useEffect, useCallback } from "react";
import { Link,  useLocation } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import PlayersNav from "../components/PlayersNav";
import { useSocketContext } from "../state/SocketContext";
import { useNavigate } from "react-router-dom";
import {  Player, Room } from "../types/types";

interface WaitingRoomProps{
  images:string[];
}



export default function WaitingRoom({ images }:WaitingRoomProps) {
  const location = useLocation();
  const roomId = location.state.roomId;
  const [players, setPlayers] = useState<Player[]>([]);
  const username:string = location.state.username;
  const navigate = useNavigate();

  const getPlayersArray = useCallback(async () => {
    const response: AxiosResponse<Player[]> = await axios.post(
      "http://localhost:2000/api/playersArray",
      {
        roomId: roomId,
      }
    );
    setPlayers(response.data)
  }, [roomId]);

  const { socket } = useSocketContext();

  useEffect(() => {
    const listener = () => {
      socket.emit("userDisconnected", { roomId:roomId, username });
    };
    window.addEventListener("beforeunload", listener);

    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, [roomId, socket, username]);

  socket.on("usersChanged", (arg:Room) => {
    console.log(arg);
    if(arg.players){
      if (arg.roomId === roomId) {
        setPlayers(arg.players);
      }
    }
    console.log(arg.players);
  });

  socket.on("disconnect", () => {
    socket.emit("userDisconnected", { roomId:roomId, username });
  });

  socket.on("gameStarted", () => {
    navigate("/GameRoom", {
      state: { username, players, roomId },
    });
  });

  useEffect(() => {
    getPlayersArray();
  }, [getPlayersArray]);

  const generateLink = () => {
    const link = `localhost:3000/JoinRoom?roomId=${roomId}`;
    return link;
  };

  const copyToClipboard = () => {
    const link = generateLink();
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const startTheGame = () => {
    socket.emit("startTheGame", { roomId:roomId });
  };

  return (
    <>
      { players && <PlayersNav players={players} images={images} />}

      <div className="flex  justify-between pl-5 pr-5 mt-80 gap-3">
        <button
          onClick={copyToClipboard}
          className="flex w-1/2 justify-center gap-2 items-center self-stretc  text-black text-base font-normal leading-7 font-inter rounded-full bg-third  "
        >
          Invite
          <img
            src="/arrow-right.png"
            alt="!"
            className=" p-[9px] bg-forth rounded-full "
          />
        </button>
        {
players && username === players[0]?.username && (
          <Link
            to={{
              pathname: "/GameRoom",
            }}
            state={{ username, players:players, roomId:roomId }}
            onClick={startTheGame}
            className="flex  w-1/2 justify-center items-center gap-2 self-stretc  text-black text-base font-normal leading-7 font-inter rounded-full bg-third "
          >
            Start
            <img
              src="/arrow-right.png"
              alt="!"
              className=" p-[9px] bg-forth rounded-full "
            />
          </Link>
        )}
      </div>
    </>
  );
}
