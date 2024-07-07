import { useContext, useEffect, useState } from "react"
import { SocketContext } from "./SocketContext"
import GameBoard from "./GameBoard"


export default function Rooms({ userData }) {
    const socket = useContext(SocketContext)
    const [userList, setUserList] = useState([])
    const [joinRequests, setJoinRequests] = useState([])
    const [opponentId, setOpponentId] = useState(null)
    const [isAwaitingResponse, setIsAwaitingResponse] = useState(false)
 
    socket.onmessage = ({ data }) => {
        console.log("Socket data from Rooms: ", data)

       try {
            const parsedMessage = JSON.parse(data)
            console.log("Parsed message type: ", parsedMessage.messageType)

            //TODO: change this to a switch with separate functions
            if(parsedMessage.messageType === "userRefresh")
                setUserList(parsedMessage.users)

            if(parsedMessage.messageType === "joinRequest") {
                const client = userList.find((user) => user.userId === parsedMessage.clientId)

                setJoinRequests(prevRequests => [...prevRequests, client])
            }

            if(parsedMessage.messageType === "acceptRequest") {
                if(isAwaitingResponse)
                    setIsAwaitingResponse(false)
            }

            if(parsedMessage.messageType === "cancelRequest") {
                const { cancellerType, cancellerId } = parsedMessage

                if(cancellerType === 'host'){
                    setOpponentId(null)
                    setIsAwaitingResponse(false)
                }
                
                if(cancellerType === 'client')
                    setJoinRequests(prevRequests => prevRequests.filter((request) => request.userId !== cancellerId))
            }
            
            if(parsedMessage.messageType === "disconnect")
                console.log(parsedMessage)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if(!userList.length)
            socket.send(JSON.stringify({ messageType: 'userRefresh' }))
    }, [])

    console.log("User list: ", userList)

    const handleSendJoinRequest = (e) => {
        const { value: hostId } = e.target

        socket.send(JSON.stringify({ messageType: 'joinRequest', clientId: userData.userId, hostId }))

        setOpponentId(hostId)
        setIsAwaitingResponse(true)
    }

    const handleRequestAccept = (e) => {
        const { value: clientId } = e.target

        socket.send(JSON.stringify({ messageType: 'acceptRequest', clientId, hostId: userData.userId }))

        setOpponentId(clientId)
    }


    const handleRequestCancel = (cancellerType, targetId) => {
        socket.send(JSON.stringify({ messageType: 'cancelRequest', cancellerType, targetId, cancellerId: userData.userId }))

        if(cancellerType === 'host') {
            setJoinRequests(prevRequests => prevRequests.filter((request) => request.userId !== targetId))
        }

        if(cancellerType === 'client') {
            setOpponentId(null)
            setIsAwaitingResponse(false)
        }
    }

    const userMap = userList.map(({ userId, username, userStatus }) => (
        <li key={userId}>
            {username}
            <button 
                value={userId}
                onClick={handleSendJoinRequest}
                disabled={userStatus !== "available"}
            >
                {userStatus === "available" ? "Join" : "Playing"}
            </button>
        </li>)
        )

    const requestMap = joinRequests.map(({ userId, username }) => (
        <li key={userId}>
            <span>{username} has requested to play with you.</span>
            <button value={userId} onClick={handleRequestAccept}>Accept</button>
            <button onClick={() => handleRequestCancel('host', userId)}>Decline</button>
        </li>
    ))

    const opponentData = userList.find((user) => user.userId === opponentId)

    return (
        <>
        {
            isAwaitingResponse 
            ?
                <div className="container">
                    <h1>Awaiting response from user {opponentData.username}.</h1>
                    <button onClick={() => handleRequestCancel('client', opponentData.userId)}>Cancel</button>
                </div>
            :
                opponentId
                ?
                    <GameBoard />
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