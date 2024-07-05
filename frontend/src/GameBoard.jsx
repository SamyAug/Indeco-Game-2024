/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./css/GameBoard.css";

const winningCombos = [
  [0, 1, 2], // Horizontal
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // Vertical
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // Diagonal
  [2, 4, 6],
];

function GameBoard({ status, handleSetStatus, statusOptions, playerSymbol }) {
  const [cells, setCells] = useState(Array(9).fill(null));
  const [winnerCombination, setWinnerCombination] = useState(
    Array(3).fill(null)
  );

  // Daca statusul indica faptul ca e randul calculatorului, se apeleaza functia pcMove
  useEffect(() => {
    if (status === statusOptions[2] || status === statusOptions[4]) {
      pcMove();
    }
  }, [pcMove, status, statusOptions]);

  /**
   * Function that handles the click event on a cell
   * @param {int} index
   * @returns
   */
  function handleCellClick(index) {
    // Daca nu s-a ales un simbol, inseamna ca inca nu a inceput jocul
    if (!playerSymbol) {
      handleSetStatus(statusOptions[0]);
      return;
    }
    // Daca celula este deja ocupata sau nu este randul jucatorului, nu se intampla nimic
    if (
      cells[index] !== null ||
      (status !== statusOptions[1] && status !== statusOptions[3])
    ) {
      return;
    }
    // Daca jucatorul alege o celula, se face mutarea si urmeaza randul calculatorului
    if (handleMove(index, playerSymbol)) {
      handleSetStatus(statusOptions[4]);
    }
  }

  /**
   * Function that handles the computer move
   * @returns
   */
  function pcMove() {
    const emptyCells = cells.reduce((acc, cell, index) => {
      if (cell === null) {
        acc.push(index);
      }
      return acc;
    }, []);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    setTimeout(() => {
      if (
        handleMove(emptyCells[randomIndex], playerSymbol === "X" ? "O" : "X")
      ) {
        handleSetStatus(statusOptions[3]);
      }
    }, 1500);
  }

  /**
   * Function that handles the move of a player (human or computer)
   * @param {int} index
   * @param {string} symbol
   * @returns the opposite result of the checkWinner function (true or false)
   */
  function handleMove(index, symbol) {
    const newCells = [...cells];
    newCells[index] = symbol;
    setCells([...newCells]);
    return !checkWinner(newCells);
  }

  /**
   * Function that checks if there is a winner
   * @param {array} cells
   * @returns true if there is a winner, false otherwise
   */
  function checkWinner(cells) {
    console.log("checkWinner", cells);
    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        setWinnerCombination(winningCombos[i]);
        handleSetStatus(
          cells[a] === playerSymbol ? statusOptions[5] : statusOptions[6]
        );
        resetGame();
        return true;
      }
    }
    if (!cells.includes(null)) {
      handleSetStatus(statusOptions[7]);
      resetGame();
      return true;
    }
    return false;
  }

  /**
   * Function that resets the game
   * @returns
   */
  function resetGame() {
    setTimeout(() => {
      setCells(Array(9).fill(null));
      setWinnerCombination(Array(3).fill(null));
      handleSetStatus(statusOptions[8]);
    }, 1500);
  }

  return (
    <>
      <div className="container">
        <div className="row border border-5 border-primary-subtle">
          {cells.map((element, index) => (
            <div
              key={index}
              role="button"
              className={`col-4 text-center align-content-center fw-bold fs-1 user-select-none 
                ${
                  status === statusOptions[1] || status === statusOptions[3]
                    ? "cell"
                    : "not-ready pe-none"
                }
                ${
                  winnerCombination.includes(index)
                    ? "bg-success text-light"
                    : !cells.includes(null) && winnerCombination.includes(null)
                    ? "bg-warning"
                    : ""
                }`}
              style={{ aspectRatio: "1 / 1" }}
              onClick={() => handleCellClick(index)}
            >
              {element}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

GameBoard.propTypes = {
  status: PropTypes.string,
  handleSetStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  playerSymbol: PropTypes.string,
};

export default GameBoard;
