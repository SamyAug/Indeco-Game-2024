
import { useState } from "react";
import "./GameBoard.css";

const timeBetweenMoves = 1000;

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function calculateWinner(stateArray) {
  for (let i = 0; i < winningCombos.length; i++) {
    let winningCombo = winningCombos[i];
    const [a, b, c] = winningCombo;
    if (stateArray[a] !== "" && stateArray[a] === stateArray[b] && stateArray[b] === stateArray[c]) return stateArray[a];
  }
  return "";
}

function existEmptyCellsOnTable(stateArray) {
  return stateArray.filter((elem) => { return elem === "" }).length > 0;
}

function GameBoard() {
  const [value, setValue] = useState("X");
  const [arr, setArr] = useState(Array(9).fill(""));

  function handleCellClick(index) {
    if (arr[index] || calculateWinner(arr)) {
      return;
    }
    else {
      let newArrayState = arr.map((element, indexElem) => {
        if (index === indexElem) return value;
        return element;
      });
      setArr(newArrayState);
      if (!calculateWinner(newArrayState)) {
        if (existEmptyCellsOnTable(newArrayState)) {
          setValue("O");
          setTimeout(() => { showComputerMove(newArrayState) }, timeBetweenMoves);
        }
        else return;
      }
    }
  }

  function showComputerMove(newArrayState) {
    let randomAvailableIndex = null;
    while (randomAvailableIndex === null) {
      let randomIndex = Math.floor(Math.random() * 9);
      if (newArrayState[randomIndex] === "") randomAvailableIndex = randomIndex;
    }
    let newArray = newArrayState.slice();
    newArray[randomAvailableIndex] = "O";
    setArr(newArray);
    setValue("X");
  }

  function calculateGameStatus() {
    let winner = calculateWinner(arr);
    if (winner) {
      return `Player ${winner} won`;
    }
    else if (existEmptyCellsOnTable(arr) === false) return "It's a draw";
    else return `Next player: ${value}`;
  }

  function resetGame() {
    setValue("X");
    setArr(Array(9).fill(""));
  }

  return (
    <>
      <div className="container">
        {calculateGameStatus()}
        {value === "O" ? (<div className="spinner-border text-secondary" role="status">
          <span className="sr-only">Waiting for partner...</span>
        </div>
        ) : null}
        <div className="row">
          {arr.map((element, index) => (
            <div
              className={`col-4 text-center align-content-center fw-bold fs-1 cell ${value === "O" ? 'pe-none' : ''}`}
              onClick={() => handleCellClick(index)}
              key={index}
              style={{ aspectRatio: "1 / 1" }}
            >
              {element}
            </div>
          ))}
        </div>
      </div>
      {!calculateGameStatus().includes("Next") ? (<div className="container">
        <button className="btn btn-warning" onClick={resetGame}>Joc nou</button>
      </div>) : null}

    </>
  );
}

export default GameBoard;
