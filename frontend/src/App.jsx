import React, { useState } from 'react'
import Register from './Register'
import SocketContextProvider from './SocketContextProvider'
import PlayerList from './PlayerList'
import Game from './Game'

const App = () => {
  const [userData, setUserData] = useState({})
  const [games, setGames] = useState([])

  return (
      <SocketContextProvider>
        {
          Object.keys(userData).length
          ?
          <>
            <PlayerList userData={userData} setGames={setGames}/>
            {games.map((game) => <Game key={game.userId}/>)}
          </>
          :
          <Register setUserData={setUserData}/>
        }
      </SocketContextProvider>
  )
}

export default App
