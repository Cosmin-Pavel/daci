import React from "react";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PickACharacter from "./PickACharacter";
import WelcomePage from "./WelcomePage";
import "./App.css";
import "./index.css";
import WaitingRoom from "./WaitingRoom";

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
  ]);

  return (
    <div className="App  flex flex-col w-full h-full">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
