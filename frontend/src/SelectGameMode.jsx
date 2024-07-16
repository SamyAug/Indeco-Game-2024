import React from "react";

const SelectGameMode = ({setGameMode }) => {
  return (
    <div>
      <button onClick={() => setGameMode("singleplayer")}>SinglePlayer</button>
      <button onClick={() => setGameMode("multiplayer")}>MultiPlayer</button>
    </div>
  );
};

export default SelectGameMode;