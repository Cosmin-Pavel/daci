import { GameState, Player } from "../types/types";


interface PlayersNavProps{
  players:Player[]
  images:string[]
  gameState?:GameState
}


const PlayersNav = ({ players, images,gameState }:PlayersNavProps) => {

 
  
  return (
<nav className="w-full flex gap-7 p-4 overflow-x-scroll border-b-2">
  {players && players.length > 0 && players.map((player, index) => (
    <div className="flex-col min-w-12 min-h-12" key={index}>
      <div className={`w-12 h-12 flex items-center justify-center ${gameState === player.username ? "bg-red-900" : "bg-purple-500"}`}>
        <img
          src={images[player.imageIndex]}
          alt="character"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <p className="text-center font-inter text-xs font-normal leading-4">
        {player.username}
      </p>
    </div>
  ))}
</nav>

  );
};

export default PlayersNav;
