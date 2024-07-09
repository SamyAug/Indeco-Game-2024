import { useContext, useEffect, useState } from 'react'
import { SocketContext } from './SocketContext'

const PlayerList = () => {
    const socket = useContext(SocketContext)
    const [userList, setUserList] = useState([])

    socket.onmessage = ({ data }) => {
        try {
            const { messageType, users } = JSON.parse(data)

            //{ messageType: "userRefresh", users }
            if(messageType === 'userRefresh') {
                setUserList(users)
            }

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if(!userList.length)
            socket.send(JSON.stringify({ messageType: 'userRefresh' }))
    }, [])


  return (
    <ul>
      {userList.map((user) => (
        <li key={user.userId}>
            {user.username}
            <button value={user.userId}>Play</button>
        </li>
      ))}
    </ul>
  )
}

export default PlayerList
