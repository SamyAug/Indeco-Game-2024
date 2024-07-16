import { useRef } from "react";
import { SocketContext } from "./SocketContext";
const socketUrl = `https://game.sigma.team/`;
//https://game.sigma.team/
export default function SocketContextProvider({ children }) {
  //const [socket] = useState(new WebSocket(`ws://${location.host}`))
  const socket = useRef(new WebSocket(socketUrl));
  console.log(socket)
  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
}
