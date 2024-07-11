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

function GameBoard() {
  // const [gameStatus, setGameStatus] = useState("Press START! to play ...");
  // const [showLoading, setShowLoading] = useState(false);
  const [value, setValue] = useState("X");
  const [mySymbol, setMySymbol] = useState("");
  const [winner, setWinner] = useState("");
  const [arr, setArr] = useState(Array(9).fill(""));
  const [gameStarted, setGameStarted] = useState(false);
  // console.log(value,'value')

  // function handleCellClick(index) {
  //   if (arr[index] || calculateWinner(arr)) {
  //     return;
  //   } else {
  //     let newArrayState = arr.map((element, indexElem) => {
  //       if (index === indexElem) return value;
  //       return element;
  //     });
  //     setGameStatus(calculateGameStatus(value));
  //     console.log(calculateGameStatus(value),'me')
  //     setArr(newArrayState);
  //     if (
  //       !calculateWinner(newArrayState) &&
  //       existEmptyCellsOnTable(newArrayState)
  //     ) {
  //       setValue((value) => (value === "X" ? "O" : "X"));
  //       setTimeout(() => {
  //         showComputerMove(newArrayState, value === "X" ? "O" : "X");
  //       }, timeBetweenMoves);
  //     }
  //   }
  // }
  function handleCellClick(index) {
    if (arr[index] || calculateWinner(arr)) {
      return;
    } else {
      console.log("Click");
      const newArrayState = arr.map((element, indexElem) => {
        if (index === indexElem) return value;
        return element;
      });
      setArr(newArrayState);
      if (calculateWinner(newArrayState)) {
        setWinner(mySymbol);
      } else if (
        !calculateWinner(newArrayState) &&
        existEmptyCellsOnTable(newArrayState)
      ) {
        setTimeout(() => {
          setValue((value)=>value==="X" ? "O" : "X")
          showComputerMove(newArrayState, mySymbol === "X" ? "O" : "X");
        }, timeBetweenMoves);
      }
    }
  }
  function showComputerMove(newArrayState, computerSymbol) {
    console.log("Aici");
    let randomAvailableIndex = null;
    while (randomAvailableIndex === null) {
      let randomIndex = Math.floor(Math.random() * 9);
      if (newArrayState[randomIndex] === "") randomAvailableIndex = randomIndex;
    }
    let newArray = [...newArrayState];
    newArray[randomAvailableIndex] = computerSymbol;
    console.log(newArray);
    setArr(newArray);
    setValue((value)=>value==="X" ? "O" : "X")

    if (calculateWinner(newArray)) {
      setWinner(computerSymbol);
    }
  }

  // function showComputerMove(newArrayState, computerSymbol) {
  //   let randomAvailableIndex = null;
  //   while (randomAvailableIndex === null) {
  //     let randomIndex = Math.floor(Math.random() * 9);
  //     if (newArrayState[randomIndex] === "") randomAvailableIndex = randomIndex;
  //   }
  //   let newArray = [...newArrayState];
  //   newArray[randomAvailableIndex] = computerSymbol;
  //   setGameStatus(calculateGameStatus(computerSymbol));
  //   console.log(calculateGameStatus(computerSymbol),'computer')

  //   setArr(newArray);
  //   setValue((value) => (value === "X" ? "O" : "X"));
  // }

  // function calculateGameStatus(currentValue) {
  //   let winner = calculateWinner(arr).winner;
  //   if (winner) {
  //     // setGameStatus(`Player ${winner} won`);
  //     return `Player ${winner} won`;
  //   } else if (existEmptyCellsOnTable(arr) === false) {
  //     // setGameStatus("It's a draw");
  //     return "It's a draw";
  //   } else if (gameStarted) {
  //     // setGameStatus(`Next player: ${value}`);
  //     // setShowLoading(value !== mySymbol);
  //     return `Next player: ${currentValue}`;
  //   }
  //   return "";
  // }

  function resetGame() {
    // setValue("X");
    setWinner("");
    const resetedArray = Array(9).fill("");
    setArr(resetedArray);
    const newSymbol = Math.random() > 0.5 ? "X" : "O";
    setMySymbol(newSymbol);
    if (newSymbol === "O") {
      console.log("Computer move");
      showComputerMove(resetedArray, "X");
    }
  }

  function isGameOver() {
    // Actualizam si statusul cand verificam daca e sfarsit de joc
    // setGameStatus(calculateGameStatus(value));
    const winner = calculateWinner(arr).winner;
    // daca am castigator sau tabla nu mai este goala, s-a sfarsit jocul
    return !!(winner || !existEmptyCellsOnTable(arr));
  }

  function startGame() {
    setGameStarted(true);
    // const myPlayerStartsFirst = Math.random() > 0.5 ? true : false;

    // if (myPlayerStartsFirst) {
    // setGameStatus(`Next player: X`);
    setMySymbol("X");
    //   return;
    // }
    // else {
    //   setMySymbol("O");
    //   // setGameStatus(`Next player: X`);

    //   showComputerMove(arr, "X");
    // }
  }
  return (
    <>
      {/* <div className="d-flex justify-content-between">
        <h5 className="me-5">{gameStatus}</h5>
        <div className={`d-flex ${!showLoading ? "visually-hidden" : ""}`}>
          <span>Waiting for partner...</span>
          <div
            className="spinner-border text-secondary ms-3"
            role="status"
          ></div>
        </div>
      </div> */}
      <div className="container">
        <div className="row border border-5 border-primary-subtle">
          {arr.map((element, index) => (
            <div
              className={`col-4 text-center align-content-center fw-bold fs-1 user-select-none
                ${
                  value !== mySymbol ||
                  !!winner
                    ? "not-ready pe-none" //cand e tura adversarului/ jocul este gata nu putem da click
                    : "cell"
                }
                ${
                  // calculateWinner(arr)?.winningCombo?.includes(index)
                  //   ? "bg-success text-light"
                  //   : !arr.includes("") &&
                  //     calculateGameStatus() === "It's a draw"
                  //   ? "bg-warning"
                  //   : ""
                  ""
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
          !winner && gameStarted ? "d-none" : "" //daca incepe jocul si nu e gata ascunde butonul
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
