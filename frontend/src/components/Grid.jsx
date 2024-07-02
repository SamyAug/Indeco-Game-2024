import React, { useState } from "react";

const winningCombos = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // top-left to bottom-right diagonal
  [2, 4, 6], // top-right to bottom-left diagonal
];

const Grid = () => {
  const [gameBoard, setGameBoard] = useState(Array(9).fill(null));
  const [currentSymbol, setCurrentSymbol] = useState("X");
  const [gameStatus, setGameStatus] = useState("Let's play!");

  /**
   * Function to handle cell click
   * @param {integer} index
   * @returns
   */
  const handleCellClick = (index) => {
    const board = [...gameBoard];
    if (board[index] !== null) return;
    board[index] = currentSymbol;
    setGameBoard(board);
    setCurrentSymbol(currentSymbol === "X" ? "O" : "X");
    checkWinner(board);
  };

  /**
   * Function to check the winner
   * @param {Array} board
   * @returns
   */
  const checkWinner = (board) => {
    const timeout = 1000;

    // If the board is full, it's a draw
    if (!board.includes(null)) {
      setGameStatus("It's a draw!");
      setTimeout(() => {
        resetGame();
      }, timeout);
      return;
    }

    // Check for winning combinations
    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setGameStatus(`Player ${board[a]} wins!`);
        setTimeout(() => {
          resetGame();
        }, timeout);
        return;
      }
    }
  };

  /**
   * Function to reset the game
   * @returns
   */
  const resetGame = () => {
    setGameStatus("Let's play again!");
    setGameBoard(Array(9).fill(null));
    setCurrentSymbol("X");
  };

  return (
    <div className="d-flex justify-content-center pt-5">
      <div className="card text-center w-75">
        <div className="card-header">
          <h3>{gameStatus}</h3>
        </div>
        <div
          className="card-body d-flex justify-content-center"
          style={{ height: 210 }}
        >
          <div className="row w-50" style={{ height: "60px" }}>
            {gameBoard.map((cell, index) => (
              <div
                key={index}
                className="col-4 h-100 border border-black flex items-center justify-center fs-1 cursor-pointer"
                onClick={() => handleCellClick(index)}
              >
                {cell}
              </div>
            ))}
          </div>
        </div>
        <div className="card-footer">
          <h3>Winner:</h3>
        </div>
      </div>
    </div>
  );
};

export default Grid;
