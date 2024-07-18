import { useState, useSyncExternalStore } from "react";
import SingleplayerGameBoard from "./SingleplayerGameBoard";
import PlayerCard from "./PlayerCard";
import GameStatus from "./GameStatus";
import MultiplayerGameBoard from "./MultiplayerGameBoard";

function Game({ gameMode, gameData, setGames, setUserRelations }) {
  // const { userData } = useContext(UserContext);
  const [gameStatus, setGameStatus] = useState(
    gameData?.symbol === "X" ? "You move" : ""
  );
  const [showLoading, setShowLoading] = useState(
    gameData?.symbol && gameData?.symbol !== "X"
  );

  return (
    <div className="container mt-5">
      <div className="row justify-content-md-center">
        <div className="col-5">
          <GameStatus
            opponentData={gameData}
            statusMessage={gameStatus}
            showLoading={showLoading}
          />
        </div>
      </div>
      <div className="row justify-content-md-center">
        <div className="col-3">
          <PlayerCard
            playerName={gameMode === "singleplayer" ? "Player1" : ""}
            imageUrl="https://cdnb.artstation.com/p/assets/images/images/020/466/229/large/andre-alvarenga-dd.jpg?1567876618"
            timeCounter={timeCounter}
         />
        </div>
        <div className="col-5">
          {gameMode === "singleplayer" ? (
            <SingleplayerGameBoard
              gameStatus={gameStatus}
              setGameStatus={setGameStatus}
              setShowLoading={setShowLoading}
            />
          ) : (
            <MultiplayerGameBoard
              setGames={setGames}
              gameData={gameData}
              gameStatus={gameStatus}
              setGameStatus={setGameStatus}
              setShowLoading={setShowLoading}
              setUserRelations={setUserRelations}
            />
          )}
        </div>
        <div className="col-3">
          <PlayerCard
            playerName={gameData.username}
            imageUrl="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG51c28xMm15bDJueXkwYTd0Z2F4MTJoYTB5cnA1Z3U3dzBnOGFmdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JsE9qckiYyVClQ5bY2/giphy.gif"
            timeCounter={timeCounter}
         />
        </div>
      </div>
    </div>
  );
}

export default Game;