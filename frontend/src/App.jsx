import { useState } from "react";
import GameBoard from "./GameBoard";

function App() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-md-center">
        <div className="cal-6">
          <GameBoard />
        </div>
      </div>
    </div>
  );
}

export default App;
