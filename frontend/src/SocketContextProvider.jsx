import { useState } from "react"
import { SocketContext } from "./SocketContext"

export default function SocketContextProvider({ children }) {
    //const [socket] = useState(new WebSocket(`ws://${location.host}`))
    const [socket] = useState(new WebSocket(`ws://localhost:8080`))

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}