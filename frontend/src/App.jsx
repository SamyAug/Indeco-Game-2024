// import { useState } from "react";

import { useState } from "react";
import GameBoard from "./GameBoard";
import GameStatus from "./GameStatus";
import PlayerCard from "./PlayerCard";

const statusOptions = [
  "Let's play! 👉 ", //0
  "You start!", //1
  "PC starts!", //2
  "Your turn ...", //3
  "PC's turn ...", //4
  "You win!", //5
  "PC wins!", //6
  "It's a tie!", //7
  "Let's play again! 👉 ", //8
];

function App() {
  const [status, setStatus] = useState(statusOptions[0]);
  const [playerSymbol, setPlayerSymbol] = useState(null);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <GameStatus
            status={status}
            handleSetStatus={setStatus}
            statusOptions={statusOptions}
            handleSetPlayerSymbol={setPlayerSymbol}
          />
        </div>
      </div>
      <div className="row justify-content-md-evenly">
        <div className="col-md-2 col-6 order-2 order-md-1">
          <PlayerCard
            name="PC"
            active={status === statusOptions[2] || status === statusOptions[4]}
            imageSrc="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXd5enU4eWgxZ3RtMDRuaWQ4dHA0MHh2ejAxcTNzYzQ3bjExcDFvZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HUpt2s9Pclgt9Vm/giphy.gif"
            isWinner={status === statusOptions[6]}
          />
        </div>
        <div className="col-md-4 col-12 order-1 order-md-2 mb-4">
          <GameBoard
            status={status}
            handleSetStatus={setStatus}
            statusOptions={statusOptions}
            playerSymbol={playerSymbol}
          />
        </div>
        <div className="col-md-2 col-6 order-3 order-md-3">
          <PlayerCard
            name="You"
            active={status === statusOptions[1] || status === statusOptions[3]}
            imageSrc="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWcyeDd0bTMydjR6aWpneGJuNnpqdjB5Z2c0eGJpYXI3eTk2dXBycyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3og0ID5AW1SmPuG3u0/giphy.webp"
            isWinner={status === statusOptions[5]}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
