import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WaitingRoom from "./WaitingRoom";
import PickACharacter from "./PickACharacter";
import WelcomePage from "./WelcomePage";
import JoinRoom from "./JoinRoom";
import "../styles/index.css";
import GameRoom from "./GameRoom";
import { SocketProvider } from "../state/SocketContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EndGame from "./EndGame";

function App() {
  const images: Array<string> = [
    "/character-1.png",
    "/favicon.ico",
    "/refresh.png",
  ];
  const router = createBrowserRouter([
    {
      path: "/",
      element: <WelcomePage />,
    },
    {
      path: "/Character",
      element: <PickACharacter images={images} />,
    },
    {
      path: "/WaitingRoom",
      element: <WaitingRoom images={images} />,
    },
    {
      path: "/JoinRoom",
      element: <JoinRoom images={images} />,
    },
    {
      path: "/GameRoom",
      element: <GameRoom images={images} />,
    },
    {
      path: "/EndGameScreen",
      element: <EndGame images={images} />,
    },
  ]);
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col w-full h-full">
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </div>
    </DndProvider>
  );
}

export default App;
