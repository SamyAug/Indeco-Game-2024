import { useContext, useState } from "react"
import { SocketContext } from "./SocketContext"


export default function Rooms({ userData }) {
    const socket = useContext(SocketContext)
    const [joinRequests, setJoinRequests] = useState([])
    const [userList, setUserList] = useState([])
    const [hostData, setHostData] = useState(null)

    socket.onmessage = ({ data }) => {
        console.log(data)

        try {
            const parsedMessage = JSON.parse(data)

            //TODO: fix lack of user list on first register
            if(parsedMessage.messageType === "userRefresh")
                setUserList(parsedMessage.users)

            if(parsedMessage.messageType === "joinRequest")
                setJoinRequests(prevRequests => [...prevRequests, parsedMessage.clientData])

        } catch (err) {
            console.log(err)
        }
    }

    const handleSendJoinRequest = (host) => {
        const { userId: hostId } = host
        socket.send(JSON.stringify({ messageType: 'joinRequest', clientData: userData, hostId }))
        setHostData(host)
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

    const userMap = userList.map((user) => (
        <li key={user.userId}>
            {user.username}
            <button 
                onClick={() => handleSendJoinRequest(user)}
            >
                {user.userStatus === "available" ? "Join" : "Playing"}
            </button>
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
        {
            hostData 
            ?
            <h1>Awaiting response from user {hostData.username}.</h1>
            :
            <div>
                <ul>
                    {userMap}
                </ul>
                {joinRequests.length > 0 && 
                    <ul>
                        {requestMap}
                    </ul>
                }
            </div>
        }
        </>
    )
}