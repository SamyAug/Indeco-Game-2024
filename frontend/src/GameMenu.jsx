import { useState } from "react";
import GameBoard from "./GameBoard";

function GameMenu() {
  const [whichGame, setWhichGame] = useState("");
  return (
    <>
      {!whichGame ? (
        <div className="row">
          <div className="col">
            <button onClick={() => setWhichGame("3")}>3X3</button>
          </div>
          <div className="col">
            <button onClick={() => setWhichGame("15")}>12X12</button>
          </div>
        </div>
      ) : whichGame === "3" ? (
        <GameBoard boardSize={3} connect={3} setBackButton={setWhichGame} />
      ) : (
        <GameBoard boardSize={12} connect={5} setBackButton={setWhichGame} />
      )}
    </>
  );
}

export default GameMenu;
