import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function WaitingRoom({ images }) {
  const location = useLocation();
  const roomId = location.state.roomId;
  console.log(roomId);
  const [playersArray, setPlayersArray] = useState([]);

  const getPlayersArray = useCallback(async () => {
    const response = await axios.post(
      "http://localhost:2000/api/playersArray",
      {
        roomId,
      }
    );
    console.log(response.data);
    setPlayersArray(response.data);
  }, [roomId]);

  useEffect(() => {
    getPlayersArray();
    const socket = io("http://localhost:2000");
    socket.on("connect", () => {
      console.log("User connected to the socket server");
    });
    // socket.on("roomUpdated", ({ roomId: updatedRoomId }) => {
    //   if (updatedRoomId === roomId) {
    //     console.log("aaaaa");
    //   }
    // });
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

  return (
    <>
      <nav className="w-full  flex gap-7 p-4 overflow-x-scroll mb-80 border-b-2">
        {[...Array(playersArray.length)].map((_, index) => (
          <div className="flex-col" key={index}>
            <img
              src={images[playersArray[index].imageIndex]}
              alt="character"
              className=" w-12 h-12 rounded-full pb-1"
            />
            <p className="text-center font-inter text-xs font-normal leading-4">
              {playersArray[index].username}
            </p>
          </div>
        ))}
      </nav>
      <div className="flex  justify-between pl-5 pr-5 gap-3">
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

        <button className="flex  w-1/2 justify-center items-center gap-2 self-stretc  text-black text-base font-normal leading-7 font-inter rounded-full bg-third ">
          Start
          <img
            src="/arrow-right.png"
            alt="!"
            className=" p-[9px] bg-forth rounded-full "
          />
        </button>
      </div>
    </>
  );
}
