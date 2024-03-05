import React from "react";

const Cards = () => {
  const numberOfCards = 5;
  return (
    <div>
      <div className="flex gap-4  justify-between ml-3 mr-3  max-w-xs  flex-wrap">
        {[...Array(numberOfCards)].map((_, index) => (
          <img
            className=" w-11 h-auto"
            src="/blue.svg"
            alt="back of the card"
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Cards;
