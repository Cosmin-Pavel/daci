import React, { createContext, useContext } from "react";
import { Socket, io } from "socket.io-client";

// Create the context
const SocketContext = createContext<Record<string, any>>({});

// Create a provider component
export const SocketProvider = ({ children }:{ children: React.ReactNode }) => {
  const socket: Socket = io("http://localhost:2000");

  return (
    <SocketContext.Provider value={ {socket} }>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to consume the context
export const useSocketContext = () => useContext(SocketContext);
