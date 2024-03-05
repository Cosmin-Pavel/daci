import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WaitingRoom from "./WaitingRoom";
import PickACharacter from "./PickACharacter";
import WelcomePage from "./WelcomePage";
import JoinRoom from "./JoinRoom";
import "../styles/index.css";
import GameRoom from "./GameRoom";
import { io } from "socket.io-client";
import { SocketProvider } from "../state/SocketContext";

function App() {
  const images = ["/character-1.png", "/favicon.ico", "/refresh.png"];
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
  ]);
  return (
    <div className="flex flex-col w-full h-full">
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </div>
  );
}

export default App;
