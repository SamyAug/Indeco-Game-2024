
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
    if (stateArray[a] !== "" && stateArray[a] === stateArray[b] && stateArray[b] === stateArray[c]) {
      return {
        winner : stateArray[a],
        winningCombo : winningCombo
      };
    }
  }
  return false;
}

function existEmptyCellsOnTable(stateArray) {
  return stateArray.filter((elem) => { return elem === "" }).length > 0;
}

/**
 * Componenta GameBoard
 * @returns interfata pentru joc
 */
function GameBoard() {
  const [value, setValue] = useState("X");
  const [mySymbol, setMySymbol] = useState("");
  const [arr, setArr] = useState(Array(9).fill(""));
  const [showBoard, setShowBoard] = useState(false);

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
          setValue((value) => value === "X" ? "O" : "X");
          setTimeout(() => { showComputerMove(newArrayState, mySymbol === "X" ? "O" : "X") }, timeBetweenMoves);
        }
        else return;
      }
    }
  }

  function showComputerMove(newArrayState, newSymbol) {
    let randomAvailableIndex = null;
    while (randomAvailableIndex === null) {
      let randomIndex = Math.floor(Math.random() * 9);
      if (newArrayState[randomIndex] === "") randomAvailableIndex = randomIndex;
    }
    let newArray = newArrayState.slice();
    newArray[randomAvailableIndex] = newSymbol;
    setArr(newArray);
    setValue((value) => value === "X" ? "O" : "X");
  }

  function calculateGameStatus() {
    let winner = calculateWinner(arr).winner;
    if (winner) {
      return `Player ${winner} won`;
    }
    else if (existEmptyCellsOnTable(arr) === false) return "It's a draw";
    else return `Next player: ${value}`;
  }

  /// Tema: La Joc nou sa se inceapa cu simbolul corect
  function resetGame() {
    setValue("X");
    const resetedArray = Array(9).fill("");
    setArr(resetedArray);
    const newSymbol = Math.random() > 0.5 ? "X" : "O"; 
    setMySymbol(newSymbol);
    if (newSymbol === "O") showComputerMove(resetedArray, "X");
  }

  function isGameOver() {
    return !calculateGameStatus().includes("Next");
  }

  function startGame(){
    setShowBoard(true);
    let myPlayerStartsFirst = Math.random() > 0.5 ? true : false;

    if(myPlayerStartsFirst){
      setMySymbol("X");
      return;
    }
    else {
      setMySymbol("O")
      showComputerMove(arr, "X");
    }
  }

  return (
    <>
      {!showBoard ? (<div className="text-center mt-3">
        <button className="btn btn-warning w-50" onClick={startGame}>Start Game</button>
      </div>) : (<>
        <div className="d-flex justify-content-between">
          <h5>{calculateGameStatus()}</h5>
          <div className={`d-flex ${value === mySymbol ? 'visually-hidden' : ''}`}>
            <span>Waiting for partner...</span>
            <div className="spinner-border text-secondary ms-3" role="status">
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            {arr.map((element, index) => (
              <div
                className={`col-4 text-center align-content-center fw-bold fs-1 
                ${isGameOver() ? 'game-over' : 'cell'} 
                ${value !== mySymbol ? 'pe-none' : ''}
                ${calculateWinner(arr).winningCombo?.includes(index) ? 'bg-success' : ''}
                `}
                onClick={() => handleCellClick(index)}
                key={index}
                style={{ aspectRatio: "1 / 1" }}
              > 
                {element}
              </div>
            ))}
          </div>
        </div>

        {isGameOver() ? (<div className="text-center mt-3">
          <button className="btn btn-warning w-50" onClick={resetGame}>Joc nou</button>
        </div>) : null}
      </>)}
    </>
  );
}

export default GameBoard;