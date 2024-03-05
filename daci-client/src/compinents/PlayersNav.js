import React from "react";

const PlayersNav = ({ playersArray, images }) => {
  return (
    <nav className="w-full flex gap-7 p-4 overflow-x-scroll border-b-2">
      {[...Array(playersArray.length)].map((_, index) => (
        <div className="flex-col min-w-12 min-h-12" key={index}>
          <div className="w-12 h-12 flex items-center justify-center">
            <img
              src={images[playersArray[index].imageIndex]}
              alt="character"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <p className="text-center font-inter text-xs font-normal leading-4">
            {playersArray[index].username}
          </p>
        </div>
      ))}
    </nav>
  );
};

export default PlayersNav;
