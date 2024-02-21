import React from "react";

import { useLocation } from "react-router-dom";

export default function WaitingRoom({ images }) {
  const location = useLocation();
  const userData = location.state.userData;
  const numberOfPlayers = 1;
  return (
    <>
      <nav className="w-full  flex gap-7 p-4 overflow-x-scroll mb-80 border-b-2">
        {[...Array(numberOfPlayers)].map((_, index) => (
          <div className="flex-col" key={index}>
            <img
              src={images[userData.imageIndex]}
              alt="character"
              className=" w-12 h-12 rounded-full pb-1"
            />
            <p className="text-center font-inter text-xs font-normal leading-4">
              {userData.username}
            </p>
          </div>
        ))}
      </nav>
      <div className="flex  justify-between pl-5 pr-5 gap-3">
        <button className="flex w-1/2 justify-center gap-2 items-center self-stretc  text-black text-base font-normal leading-7 font-inter rounded-full bg-third  ">
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
