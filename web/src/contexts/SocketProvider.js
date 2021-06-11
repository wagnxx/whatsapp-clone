import React from 'react';
import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export default function SocketProvider({ id, children }) {
  const [socket, setsocket] = useState();

  useEffect(() => {
    const newSocket = io('http://192.168.1.101:5000', {
      query: { id },
    });
    setsocket(newSocket);
    return () => newSocket.close();
  }, [id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
