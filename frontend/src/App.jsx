import React, { createContext, useState } from "react";
import Register from "./Register";
import SocketContextProvider from "./SocketContextProvider";
import PlayerList from "./PlayerList";
import Game from "./Game";
import Modal from "./Modal";
import SelectGameMode from "./SelectGameMode";
import SingleplayerGameBoard from "./SingleplayerGameBoard";

export const UserContext = createContext();

const App = () => {
  const [userData, setUserData] = useState({});
  const [games, setGames] = useState([]);
  const [userRelations, setUserRelations] = useState([]);
  const [gameMode, setGameMode] = useState(null);

  return gameMode ? (
    gameMode === "singleplayer" ? (
      <Game
        gameMode={gameMode}
        gameData={{
          username: "Computer",
          // symbol: Math.random() > 0.5 ? "X" : "O",
        }}
      />
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
    <SelectGameMode setGameMode={setGameMode} />
  );
};

export default App;