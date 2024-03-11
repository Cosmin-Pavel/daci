import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { Link, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import PlayersNav from "../compinents/PlayersNav";
import { useSocketContext } from "../state/SocketContext";
import { useNavigate } from "react-router-dom";

export default function WaitingRoom({ images }) {
  const location = useLocation();
  const roomId = location.state.roomId;
  const username = location.state.username;
  const [playersArray, setPlayersArray] = useState([]);
  const navigate = useNavigate();

  const getPlayersArray = useCallback(async () => {
    const response = await axios.post(
      "http://localhost:2000/api/playersArray",
      {
        roomId,
      }
    );
    setPlayersArray(response.data);
  }, [roomId]);

  const { socket } = useSocketContext();

  useEffect(() => {
    const listener = () => {
      socket.emit("userDisconnected", { roomId, username });
    };
    window.addEventListener("beforeunload", listener);

    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, [roomId, socket, username]);

  socket.on("usersChanged", (arg) => {
    if (arg.roomId === roomId) setPlayersArray(arg.players);
  });

  socket.on("disconnect", () => {
    socket.emit("userDisconnected", { roomId, username });
  });

  socket.on("gameStarted", (arg) => {
    console.log(arg);
    console.log(roomId);
    if (roomId === arg.roomId) console.log("aaaaaaaaa");
    navigate("/GameRoom", {
      state: { username, playersArray, roomId },
    });
  });

  useEffect(() => {
    getPlayersArray();
  }, [getPlayersArray, roomId]);

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
    socket.emit("startTheGame", { roomId });
  };

  return (
    <>
      <PlayersNav playersArray={playersArray} images={images} />

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
        {username === playersArray[0]?.username && (
          <Link
            to={{
              pathname: "/GameRoom",
            }}
            state={{ username, playersArray, roomId }}
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
