import { useContext, useState } from "react"
import Rooms from "./Rooms"
import { SocketContext } from "./SocketContext"

export default function Register() {
    const socket = useContext(SocketContext)
    const [message, setMessage] = useState('')
    const [userData, setUserData] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')

    socket.onmessage = ({ data }) => {
        console.log("Socket message from Register: ", data)
        try {
            const parsedMessage = JSON.parse(data)
    
            if(parsedMessage.messageType === "authentication") {
                setUserData({ userId: parsedMessage.userId, username: parsedMessage.username})
                setErrorMessage('')
            }

            if(parsedMessage.messageType === "registerError")
                setErrorMessage(parsedMessage.message)
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        const { value } = e.target

        setMessage(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        socket.send(JSON.stringify({ messageType: "authentication", registerAs: message }))
    }

    return (
        <>
            {errorMessage && <h1>{errorMessage}</h1>}
        {
            userData
            ? 
                <Rooms userData={userData} />
            : 
                <div>
                    <form>
                        <input type='text' value={message} onChange={handleChange}/>
                        <button type="submit" onClick={handleSubmit}>Submit</button>
                    </form>
                </div>
        }
        </>

    )
}