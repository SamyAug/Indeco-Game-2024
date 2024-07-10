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
    <div className="cointainer col-2 ms-2">
    <ul className="list-group list-group-numbered">
      {userList.map((user) => (
        <li className="list-group-item" key={user.userId}>
            {user.username}
            <button  className="btn btn-primary ms-2" value={user.userId}>Play</button>
        </li>
      ))}
    </ul>
    </div>
  )
}

export default PlayerList
