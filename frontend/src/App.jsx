import React, { useState } from 'react'
import Register from './Register'
import SocketContextProvider from './SocketContextProvider'
import PlayerList from './PlayerList'

const App = () => {
  const [userData, setUserData] = useState(false)

  return (
      <SocketContextProvider>
        {
          userData
          ?
          <PlayerList />
          :
          <Register setUserData={setUserData}/>
        }
      </SocketContextProvider>
  )
}

export default App
