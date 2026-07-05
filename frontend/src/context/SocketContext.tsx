// import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import { io, Socket } from "socket.io-client";

// interface SocketContextType {
//   socket: Socket | null;
//   isConnected: boolean;
// }

// const SocketContext = createContext<SocketContextType | undefined>(undefined);

// export const SocketProvider = ({ children }: { children: ReactNode }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "http://localhost:3000";
//     const socketInstance = io(API_BASE_URL, {
//       withCredentials: true,
//     });

//     socketInstance.on("connect", () => {
//       console.log("Socket connected:", socketInstance.id);
//       setIsConnected(true);
//     });

//     socketInstance.on("disconnect", () => {
//       console.log("Socket disconnected");
//       setIsConnected(false);
//     });

//     setSocket(socketInstance);

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={{ socket, isConnected }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error("useSocket must be used within a SocketProvider");
//   }
//   return context;
// };


import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Safe extraction without breaks
    const envUrl = import.meta.env.VITE_API_BASE_URL;

    // 2. Clear clean URL logging to trace production bugs
    console.log("Current Socket Connecting to URL:", envUrl);

    // 3. Fallback only if strictly undefined/empty
    const API_BASE_URL = (envUrl && envUrl.trim() !== "" ? envUrl : "http://localhost:3000").replace(/\/$/, "");

    const socketInstance = io(API_BASE_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"], // Force websocket first to bypass CORS proxy drops
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected successfully with ID:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected from server");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};