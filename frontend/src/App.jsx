import React, { createContext, useState } from "react";
import Register from "./Register";
import SocketContextProvider from "./SocketContextProvider";
import PlayerList from "./PlayerList";
import Game from "./Game";
import Modal from "./Modal";

export const UserContext = createContext();

const App = () => {
  const [userData, setUserData] = useState({});
  const [games, setGames] = useState([]);
  const [userRelations, setUserRelations] = useState([]);

  return (
    <SocketContextProvider>
      <UserContext.Provider value={{ userData, setUserData }}>
        {Object.keys(userData).length ? (
          <>
            <PlayerList
              setGames={setGames}
              userRelations={userRelations}
              setUserRelations={setUserRelations}
            />
            {games.map((game) => (
              <Game
                key={game.userId}
                gameData={game}
                setGames={setGames}
                setUserRelations={setUserRelations}
              />
            ))}
          </>
        ) : (
          <Register />
        )}
      </UserContext.Provider>
    </SocketContextProvider>
  );
};

export default App;
