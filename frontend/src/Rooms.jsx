import { useContext, useState } from "react"
import { SocketContext } from "./SocketContext"


export default function Rooms({ userData }) {
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
                setJoinRequests(prevRequests => [...prevRequests, parsedMessage.clientData])

        } catch (err) {
            console.log(err)
        }
    }

    const handleSendJoinRequest = (e) => {
        const { value: hostId } = e.target

        socket.send(JSON.stringify({ messageType: 'joinRequest', clientData: userData, hostId }))
    }

    const handleRequestAccept = (e) => {
        //TODO
        const { value: hostId } = e.target
        console.log(hostId)

    }

    const handleRequestDecline = (e) => {
        //TODO
        const { value: hostId } = e.target
        console.log(hostId)
    }

    const userMap = userList.map(({ userId, username }) => (
        <li key={userId}>
            {username}
            <button value={userId} onClick={handleSendJoinRequest}>Join</button>
        </li>)
        )

    const requestMap = joinRequests.map(({ userId, username }) => (
        <li key={userId}>
            <span>{username} has requested to play with you.</span>
            <button value={userId} onClick={handleRequestAccept}>Accept</button>
            <button value={userId} onClick={handleRequestDecline}>Decline</button>
        </li>
    ))

    return (
        <>
            <ul>
                {userMap}
            </ul>
            {joinRequests.length > 0 && 
                <ul>
                    {requestMap}
                </ul>
            }
        </>
    )
}