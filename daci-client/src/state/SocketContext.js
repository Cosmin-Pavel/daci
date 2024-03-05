import React, { createContext, useState, useContext } from "react";
import { io } from "socket.io-client";

// Create the context
const SocketContext = createContext();

// Create a provider component
export const SocketProvider = ({ children }) => {
  const socket = io("http://localhost:2000");

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to consume the context
export const useSocketContext = () => useContext(SocketContext);
