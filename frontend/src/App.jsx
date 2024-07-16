import React, { createContext, useState } from "react";
import Register from "./Register";
import SocketContextProvider from "./SocketContextProvider";
import PlayerList from "./PlayerList";
import Game from "./Game";
import Modal from "./Modal";
import SingleplayerGameBoard from "./SingleplayerGameBoard";

export const UserContext = createContext();

const App = () => {
  const [userData, setUserData] = useState({});
  const [games, setGames] = useState([]);
  const [userRelations, setUserRelations] = useState([]);
  const [gamemode, setGamemode] = useState('singleplayer');

  return gamemode ? (
    gamemode === "singleplayer" ? (
      <Game />
    ) : (
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
    )
  ) : (
    <SelectGameMode />
  );
};

export default App;
