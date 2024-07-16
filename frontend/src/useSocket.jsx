import { useContext, useEffect } from "react";
import { SocketContext } from "./SocketContext";

export function useSocket(callback) {
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const message = JSON.parse(event.data);
      callback(message);
    };
    socket.addEventListener("message", handleMessage);
    // Clean up on unmount
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, callback]);
  return socket;
}
