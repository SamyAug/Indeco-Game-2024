import { useContext, useEffect } from "react";
import { SocketContext } from "./SocketContext";

export function useSocket(callback) {
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("on message")
      callback(message);
    };

    // Clean up on unmount
    return () => {
      socket.onmessage = null;
    };
  }, [socket, callback]);

  return socket;
}
