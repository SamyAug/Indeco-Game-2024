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
  [2, 4, 6],
];

function calculateWinner(stateArray) {
  for (let i = 0; i < winningCombos.length; i++) {
    let winningCombo = winningCombos[i];
    const [a, b, c] = winningCombo;
    if (
      stateArray[a] !== "" &&
      stateArray[a] === stateArray[b] &&
      stateArray[b] === stateArray[c]
    ) {
      return { winner: stateArray[a], winningCombo: winningCombo };
    }
  }
  return false;
}

function existEmptyCellsOnTable(stateArray) {
  return (
    stateArray.filter((elem) => {
      return elem === "";
    }).length > 0
  );
}

/**
 * Componenta GameBoard
 * @returns interfata pentru joc
 */
// eslint-disable-next-line react/prop-types
function GameBoard({ handleGameStatus, handleShowLoading }) {
  const [value, setValue] = useState("X");
  const [mySymbol, setMySymbol] = useState("");
  const [arr, setArr] = useState(Array(9).fill(""));
  const [gameStarted, setGameStarted] = useState(false);

  function handleCellClick(index) {
    if (arr[index] || calculateWinner(arr)) {
      return;
    } else {
      let newArrayState = arr.map((element, indexElem) => {
        if (index === indexElem) return value;
        return element;
      });
      setArr(newArrayState);
      if (
        !calculateWinner(newArrayState) &&
        existEmptyCellsOnTable(newArrayState)
      ) {
        setValue((value) => (value === "X" ? "O" : "X"));
        setTimeout(() => {
          showComputerMove(newArrayState, value === "X" ? "O" : "X");
        }, timeBetweenMoves);
      }
    }
  }

  function showComputerMove(newArrayState, computerSymbol) {
    let randomAvailableIndex = null;
    while (randomAvailableIndex === null) {
      let randomIndex = Math.floor(Math.random() * 9);
      if (newArrayState[randomIndex] === "") randomAvailableIndex = randomIndex;
    }
    let newArray = [...newArrayState];
    newArray[randomAvailableIndex] = computerSymbol;
    setArr(newArray);
    setValue((value) => (value === "X" ? "O" : "X"));
  }

  function calculateGameStatus() {
    let winner = calculateWinner(arr).winner;
    if (winner) {
      handleGameStatus(`Player ${winner} won`);
      return `Player ${winner} won`;
    } else if (existEmptyCellsOnTable(arr) === false) {
      handleGameStatus("It's a draw");
      return "It's a draw";
    } else if (gameStarted) {
      handleGameStatus(`Next player: ${value}`);
      handleShowLoading(value !== mySymbol);
      return `Next player: ${value}`;
    }
    return "";
  }

  function resetGame() {
    setValue("X");
    const resetedArray = Array(9).fill("");
    setArr(resetedArray);
    const newSymbol = Math.random() > 0.5 ? "X" : "O";
    setMySymbol(newSymbol);
    if (newSymbol === "O") {
      showComputerMove(resetedArray, "X");
    }
  }

  function isGameOver() {
    // Actualizam si statusul cand verificam daca e sfarsit de joc
    calculateGameStatus();
    const winner = calculateWinner(arr).winner;
    // daca am castigator sau tabla nu mai este goala, s-a sfarsit jocul
    return (winner || !existEmptyCellsOnTable(arr));
  }

  function startGame() {
    setGameStarted(true);
    const myPlayerStartsFirst = Math.random() > 0.5 ? true : false;

    if (myPlayerStartsFirst) {
      setMySymbol("X");
      return;
    } else {
      setMySymbol("O");
      showComputerMove(arr, "X");
    }
  }
  return (
    <>
      <div className="container">
        <div className="row border border-5 border-primary-subtle">
          {arr.map((element, index) => (
            <div
              className={`col-4 text-center align-content-center fw-bold fs-1 user-select-none
                ${
                  value !== mySymbol || isGameOver()
                    ? "not-ready pe-none"
                    : "cell"
                }
                ${
                  calculateWinner(arr)?.winningCombo?.includes(index)
                    ? "bg-success text-light"
                    : !arr.includes("") &&
                      calculateGameStatus() === "It's a draw"
                    ? "bg-warning"
                    : ""
                }
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

      <div
        className={`text-center mt-3 ${
          !isGameOver() && gameStarted ? "d-none" : ""
        }`}
      >
        <button
          className="btn btn-warning w-50"
          onClick={!gameStarted ? startGame : resetGame}
        >
          Joc nou
        </button>
      </div>
    </>
  );
}

export default GameBoard;
