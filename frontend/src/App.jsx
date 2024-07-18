import React, { createContext, useState } from "react";
import Register from "./Register";
import SocketContextProvider from "./SocketContextProvider";
import PlayerList from "./PlayerList";
import Game from "./Game";
import GameMode from "./GameMode";
import SinglePlayerGame from "./SinglePlayerGame";

export const UserContext = createContext();

const App = () => {
  const [userData, setUserData] = useState({});
  const [games, setGames] = useState([]);
  const [gameMode, setGameMode] = useState(null);
  const [userRelations, setUserRelations] = useState([]);

  function handleSelectMode(mode) {
    setGameMode(mode);
  }

  function handleBackToMenu() {
    setGameMode(null);
  }

  
  return gameMode ?  (
    gameMode === "singleplayer" ? (
      <SinglePlayerGame setGames={setGames} onBackToMenu={handleBackToMenu} />
    ) : (
      <SocketContextProvider>
        <UserContext.Provider value={{ userData, setUserData }}>
          {Object.keys(userData).length ? (
            <>
            <div className="row">
              <div className="col-2 position-fixed overflow-y-auto" style={{height: "25em"}}>
              <PlayerList
                setGames={setGames}
                userRelations={userRelations}
                setUserRelations={setUserRelations}
                onBackToMenu={handleBackToMenu}
              />
              </div>
              <div className="col text-center">
              {games.map((game) => (
                <Game
                  key={game.userId}
                  gameData={game}
                  setGames={setGames}
                  setUserRelations={setUserRelations}
                />
              ))}
              </div>
              </div>
            </>
          ) : (
            <Register
              onRegister={(data) => setUserData(data)}
              onBackToMenu={handleBackToMenu}
            />
          )}
        </UserContext.Provider>
      </SocketContextProvider>
    )
  ) : (
    <GameMode onSelectMode={handleSelectMode} />
  );
  
};

export default App;
