import { useRef, useState } from "react";
import { SocketContext } from "./SocketContext";
const socketUrl = `ws://localhost:8080/`;
export default function SocketContextProvider({ children }) {
  //const [socket] = useState(new WebSocket(`ws://${location.host}`))
  const socket = useRef(new WebSocket(socketUrl));
  const [messageHandlers, setMessageHandlers] = useState(() => new Set())

  socket.current.onmessage = ({ data }) => {
    try {
      const parsedMessage = JSON.parse(data)
      messageHandlers.forEach(handler => handler(parsedMessage))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <SocketContext.Provider value={{ socket: socket.current, setMessageHandlers }}>
      {children}
    </SocketContext.Provider>
  );
}
