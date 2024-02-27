import React from "react";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WaitingRoom from "./WaitingRoom";
import PickACharacter from "./PickACharacter";
import WelcomePage from "./WelcomePage";
import JoinRoom from "./JoinRoom";
import "./App.css";
import "./index.css";

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
  ]);

  return (
    <div className="App  flex flex-col w-full h-full">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
