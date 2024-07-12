import React, { createContext, useState } from "react";
import Register from "./Register";
import SocketContextProvider from "./SocketContextProvider";
import PlayerList from "./PlayerList";
import Game from "./Game";

export const UserContext = createContext();

const App = () => {
  const [userData, setUserData] = useState({});
  const [games, setGames] = useState([]);

  return (
    <SocketContextProvider>
      <UserContext.Provider value={{ userData, setUserData }}>
        {Object.keys(userData).length ? (
          <>
            <PlayerList setGames={setGames} />
            {games.map((game) => (
              <Game key={game.userId} gameData = {game}  />
            ))}
          </>
        ) : (
          <Register/>
        )}
      </UserContext.Provider>
    </SocketContextProvider>
  );
};

export default App;
