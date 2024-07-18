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

function SingleplayerGameBoard({ gameStatus, setGameStatus, setShowLoading }) {
  const [value, setValue] = useState("X");
  const [mySymbol, setMySymbol] = useState("");
  const [arr, setArr] = useState(Array(9).fill(""));
  const [gameStarted, setGameStarted] = useState(false);

  function handleCellClick(index) {
    if (arr[index] || calculateWinner(arr)) {
      return;
    } else {
      const newArrayState = arr.map((element, indexElem) => {
        if (index === indexElem) return value;
        return element;
      });
      setArr(newArrayState);
      if (calculateWinner(newArrayState)) {
        setGameStatus(`Player ${mySymbol} won`); //daca am castigat eu
      } else if (!existEmptyCellsOnTable(newArrayState)) {
        setGameStatus("Draw"); //daca e egal dupa ce am mutat
      } else if (
        !calculateWinner(newArrayState) &&
        existEmptyCellsOnTable(newArrayState)
      ) {
        //urmeaza mutarea oponentului
        setGameStatus(`Player ${mySymbol === "X" ? "O" : "X"} next move`);
        setShowLoading(true);
        setValue((value) => (value === "X" ? "O" : "X"));
        setTimeout(() => {
          showComputerMove(newArrayState, mySymbol === "X" ? "O" : "X");
        }, timeBetweenMoves);
      }
    }
  }
  function showComputerMove(newArrayState, computerSymbol) {
    let randomAvailableIndex = null;
    while (randomAvailableIndex === null) {
      //index random pentru o pozitie libera
      let randomIndex = Math.floor(Math.random() * 9);
      if (newArrayState[randomIndex] === "") randomAvailableIndex = randomIndex;
    }
    let newArray = [...newArrayState];
    newArray[randomAvailableIndex] = computerSymbol;
    setArr(newArray);
    setValue((value) => (value === "X" ? "O" : "X"));
    setShowLoading(false);

    if (calculateWinner(newArray)) {
      //daca a castigat computerul
      setGameStatus(`Player ${computerSymbol} won`);
      return;
    } else if (!existEmptyCellsOnTable(newArray)) {
      //daca e egal dupa mutare
      setGameStatus("Draw");
      return;
    }
    setGameStatus(`Player ${computerSymbol === "X" ? "O" : "X"} next move`); // setam statusul pentru urmatorul player
  }

  function resetGame() {
    setValue("X");
    setGameStatus("Player X moves next");
    const resetedArray = Array(9).fill("");
    setArr(resetedArray);
    const newSymbol = Math.random() > 0.5 ? "X" : "O";
    setMySymbol(newSymbol);
    if (newSymbol === "O") {
      showComputerMove(resetedArray, "X");
    }
  }

  function startGame() {
    setGameStarted(true);
    const myPlayerStartsFirst = Math.random() > 0.5 ? true : false;

    if (myPlayerStartsFirst) {
      setMySymbol("X");
    } else {
      setMySymbol("O");
      showComputerMove(arr, "X");
    }
    setGameStatus(`Player X moves next`);
  }
  return (
    <>
      <div className="container">
        <div className="row border border-5 border-primary-subtle">
          {arr.map((element, index) => (
            <div
              className={`col-4 text-center align-content-center fw-bold fs-1 user-select-none
                ${
                  value !== mySymbol ||
                  gameStatus === "Player X won" ||
                  gameStatus === "Player O won" ||
                  gameStatus === "Draw"
                    ? "not-ready pe-none" //cand e tura adversarului/ jocul este gata nu putem da click
                    : "cell"
                }
                ${
                  calculateWinner(arr)?.winningCombo?.includes(index)
                    ? "bg-success text-light"
                    : gameStatus === "Draw"
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
          gameStatus !== "Press START! to play ..." &&
          gameStatus !== "Player X won" &&
          gameStatus !== "Player O won" &&
          gameStatus !== "Draw" &&
          gameStarted
            ? "d-none"
            : "" //daca incepe jocul si nu e gata ascunde butonul
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

export default SingleplayerGameBoard;
