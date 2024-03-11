import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { Link, Navigate, useLocation } from "react-router-dom";
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
  // const roomId = location.state.roomId;
  // const [playersArray, setPlayersArray] = useState<string[]>([]);
  const [roomData, setRoomData] = useState<Room>({roomId:location.state.roomId, playersArray:[]})
  const username:string = location.state.username;
  const navigate = useNavigate();

  const getPlayersArray = useCallback(async () => {
    const response: AxiosResponse<Player[]> = await axios.post(
      "http://localhost:2000/api/playersArray",
      {
        roomId:roomData.roomId,
      }
    );
    setRoomData({...roomData, playersArray: response.data});
  }, [roomData]);

  const { socket } = useSocketContext();

  useEffect(() => {
    const listener = () => {
      socket.emit("userDisconnected", { roomId:roomData.roomId, username });
    };
    window.addEventListener("beforeunload", listener);

    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, [roomData.roomId, socket, username]);

  socket.on("usersChanged", (arg:Room) => {
    if(arg.playersArray){
      if (arg.roomId === roomData.roomId) setRoomData({...roomData, playersArray: arg.playersArray});

    }
  });

  socket.on("disconnect", () => {
    socket.emit("userDisconnected", { roomId:roomData.roomId, username });
  });

  socket.on("gameStarted", () => {
    navigate("/GameRoom", {
      state: { username, playersArray:roomData.playersArray, roomId:roomData.roomId },
    });
  });

  useEffect(() => {
    getPlayersArray();
  }, [getPlayersArray, roomData.roomId]);

  const generateLink = () => {
    const link = `localhost:3000/JoinRoom?roomId=${roomData.roomId}`;
    return link;
  };

  const copyToClipboard = () => {
    const link = generateLink();
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const startTheGame = () => {
    socket.emit("startTheGame", { roomId:roomData.roomId });
  };

  return (
    <>
      { roomData.playersArray && <PlayersNav playersArray={roomData.playersArray} images={images} />}

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
roomData.playersArray && username === roomData.playersArray[0]?.username && (
          <Link
            to={{
              pathname: "/GameRoom",
            }}
            state={{ username, playersArray:roomData.playersArray, roomId:roomData.roomId }}
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
