import { useContext, useState } from "react"
import { SocketContext } from "./SocketContext"


export default function Rooms() {
    const socket = useContext(SocketContext)
    const [joinRequests, setJoinRequests] = useState([])
    const [userList, setUserList] = useState([])

    socket.onmessage = ({ data }) => {
        console.log(data)

        try {
            const parsedMessage = JSON.parse(data)

            if(parsedMessage.messageType === "userRefresh")
                setUserList(parsedMessage.users)

            if(parsedMessage.messageType === "joinRequest")
                setJoinRequests(prevRequests => [...prevRequests, parsedMessage.requesterData])

        } catch (err) {
            console.log(err)
        }
    }

    const handleRequestAccept = (e) => {
        //TODO
        const { value: userId } = e.target


    }

    const handleRequestDecline = (e) => {
        //TODO
        const { value: userId } = e.target
    }

    const userMap = userList.map(({ userId, username }) => (
        <li key={userId}>
            {username}
            <button value={userId}>Join</button>
        </li>)
        )

    const requestMap = joinRequests.map(({ userId, username }) => (
        <li key={userId}>
            <span>{username} has requested to play with you.</span>
            <button onClick={handleRequestAccept} value={userId}>Accept</button>
            <button onClick={handleRequestDecline} value={userId}>Decline</button>
        </li>
    ))

    return (
        <>
            <ul>
                {userMap}
            </ul>
            {joinRequests.length && 
                <ul>
                    {requestMap}
                </ul>
            }
        </>
    )
}