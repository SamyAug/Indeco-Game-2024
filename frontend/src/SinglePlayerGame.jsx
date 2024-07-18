/* eslint-disable react/prop-types */
import { useState } from "react";
import SingleplayerGameBoard from "./SingleplayerGameBoard";
import PlayerCard from "./PlayerCard";
import GameStatus from "./GameStatus";

function SinglePlayerGame({ onBackToMenu }) {
  const [gameStatus, setGameStatus] = useState("Press START! to play ...");
  const [showLoading, setShowLoading] = useState(false);

  return (
    <div className="container mt-5">
      <div className="row justify-content-md-center">
        <div className="col-5">
          <GameStatus
            opponentData={{ playerName: "PC" }}
            statusMessage={gameStatus}
            showLoading={showLoading}
          />
        </div>
      </div>
      <div className="row justify-content-md-center">
        <div className="col-3">
          <PlayerCard
            playerName="Jucătorul 1"
            imageUrl="https://cdnb.artstation.com/p/assets/images/images/020/466/229/large/andre-alvarenga-dd.jpg?1567876618"
          />
        </div>
        <div className="col-5">
          <SingleplayerGameBoard
            gameStatus={gameStatus}
            setGameStatus={setGameStatus}
            setShowLoading={setShowLoading}
            onBackToMenu={onBackToMenu} // Transmite onBackToMenu
          />
        </div>
        <div className="col-3">
          <PlayerCard
            playerName="PC"
            imageUrl="https://media0.giphy.com/media/JsE9qckiYyVClQ5bY2/giphy.gif?cid=6c09b952t9pmpruol4hnbnge9mgc4z1k5w11ie07c3k5m3ax&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g "
          />
        </div>
      </div>
    </div>
  );
}

export default SinglePlayerGame;
