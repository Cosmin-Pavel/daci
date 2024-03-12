import axios from "axios";
import React from "react";

interface TableProps{
  roomId:string
  username:string
  gameState:string
}






const Table = ({roomId,username,gameState}:TableProps) => {

  const drawACard = async () => {
    console.log(roomId);
    await axios.post("http://localhost:2000/api/drawACard",{roomId,username})
  }


  return <div className="flex justify-between ml-9 mr-9 mt-20 mb-20">
    <div className="w-32 h-44 bg-slate-600">

    </div>
    <img src="Deck.svg" alt="deck" onClick={drawACard}/>
  </div>;
};

export default Table;
