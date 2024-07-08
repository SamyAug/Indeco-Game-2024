import { useRef } from "react"
import { SocketContext } from "./SocketContext"
const socketUrl = `ws://localhost:8080/`;
export default function SocketContextProvider({ children }) {
    //const [socket] = useState(new WebSocket(`ws://${location.host}`))
    const socket = useRef(new WebSocket(socketUrl));

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}