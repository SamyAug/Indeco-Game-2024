import { useContext, useState } from "react"
import { SocketContext } from "./SocketContext"


export default function Rooms({ userData }) {
    const socket = useContext(SocketContext)
    const [userList, setUserList] = useState([])
    const [joinRequests, setJoinRequests] = useState([])
    const [opponentId, setOpponentId] = useState(null)
    const [isAwaitingResponse, setIsAwaitingResponse] = useState(false)

    socket.onmessage = ({ data }) => {
        console.log("Socket data from Rooms: ", data)

        //TODO: fix try catch block not always getting executed
       try {
           const parsedMessage = JSON.parse(data)
           console.log("Parsed message type: ", parsedMessage.messageType)

            if(parsedMessage.messageType === "userRefresh")
                setUserList(parsedMessage.users)

            if(parsedMessage.messageType === "joinRequest") {
                const client = userList.find((user) => user.userId === parsedMessage.clientId)


                setJoinRequests(prevRequests => [...prevRequests, client])
            }

        } catch (err) {
            console.log(err)
        }
    }

    console.log("User list: ", userList)

    const handleSendJoinRequest = (host) => {
        const { userId: hostId } = host

        socket.send(JSON.stringify({ messageType: 'joinRequest', clientId: userData.userId, hostId }))

        setOpponentId(hostId)
        setIsAwaitingResponse(true)
    }

    const handleRequestAccept = (e) => {
        const { value: clientId } = e.target

        socket.send(JSON.stringify({ messageType: 'acceptRequest'}))

        setOpponentId(clientId)
    }

    const handleRequestDecline = (e) => {
        const { value: clientId } = e.target


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

    const opponentData = userList.find((user) => user.userId === opponentId)

    return (
        <>
        {
            isAwaitingResponse 
            ?
            <h1>Awaiting response from user {opponentData.username}.</h1>
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