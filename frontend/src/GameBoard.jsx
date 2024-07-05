<<<<<<< HEAD
import { Fragment, useState } from "react";
import "./GameBoard.css";

function GameBoard({ boardSize, connect, setBackButton }) {
  const [arr, setArr] = useState(
    Array(boardSize).fill(Array(boardSize).fill(""))
  );
  const [currentSymbol, setCurrentSymbol] = useState("X");

  const handleClick = (i, j) => {
    if (!arr[i][j]) {
      setCurrentSymbol(currentSymbol === "X" ? "O" : "X");
      setArr(
        arr.map((row, indexRow) =>
          row.map((element, elementIndex) =>
            indexRow === i && elementIndex === j ? currentSymbol : element
          )
        )
      );
      if (checkWinner(i, j)) {
        alert(`Winner ${currentSymbol}`);
        setArr(Array(boardSize).fill(Array(boardSize).fill("")));
        setCurrentSymbol("X");
      } else null;
    }
  };

  const checkWinner = (coordonataX, coordonataY) => {
    const intervalOrizontala = {
      inceput: coordonataY - connect - 1 < 0 ? 0 : coordonataY - connect - 1,
      sfarsit:
        coordonataY + connect - 1 > boardSize - 1
          ? boardSize - 1
          : coordonataY + connect - 1,
    };

    const intervalVerticala = {
      inceput: coordonataX - connect - 1 < 0 ? 0 : coordonataX - connect - 1,
      sfarsit:
        coordonataX + connect - 1 > boardSize - 1
          ? boardSize - 1
          : coordonataX + connect - 1,
    };

    const primaDiagonala = [];
    const aDouaDiagonala = [];

    for (let m = -(connect - 1); m <= connect - 1; m++) {
      if (
        coordonataX + m >= 0 &&
        coordonataY + m >= 0 &&
        coordonataX + m < boardSize &&
        coordonataY + m < boardSize
      )
        primaDiagonala.push({ x: coordonataX + m, y: coordonataY + m });

      if (
        coordonataX - m >= 0 &&
        coordonataY + m >= 0 &&
        coordonataX - m < boardSize &&
        coordonataY + m < boardSize
      ) {
        aDouaDiagonala.push({ x: coordonataX - m, y: coordonataY + m });
      }
    }

    let count = 0;

    for (
      let m = intervalVerticala.inceput;
      m <= intervalVerticala.sfarsit;
      m++
    ) {
      if (arr[m][coordonataY] === currentSymbol || m === coordonataX) count++;
      else if (arr[m][coordonataY] !== currentSymbol) count = 0;

      if (count === connect) return currentSymbol;
    }

    count = 0;

    for (
      let n = intervalOrizontala.inceput;
      n <= intervalOrizontala.sfarsit;
      n++
    ) {
      if (arr[coordonataX][n] === currentSymbol || n === coordonataY) count++;
      else if (arr[coordonataX][n] !== currentSymbol) count = 0;

      if (count === connect) return currentSymbol;
    }

    count = 0;

    for (let i = 0; i < primaDiagonala.length; i++) {
      const el = primaDiagonala[i];
      if (
        arr[el.x][el.y] === currentSymbol ||
        (el.x === coordonataX && el.y === coordonataY)
      ) {
        count++;
      } else if (arr[el.x][el.y] !== currentSymbol) {
        count = 0;
      }

      if (count === connect) {
        return currentSymbol;
      }
    }

    count = 0;

    for (let i = 0; i < aDouaDiagonala.length; i++) {
      const el = aDouaDiagonala[i];
      if (
        arr[el.x][el.y] === currentSymbol ||
        (el.x === coordonataX && el.y === coordonataY)
      ) {
        count++;
      } else if (arr[el.x][el.y] !== currentSymbol) {
        count = 0;
      }

      if (count === connect) {
        return currentSymbol;
      }
    }

    return null;
  };

  return (
    <div className="container">
      <button className="mb-2" onClick={() => setBackButton("")}>
        Back
      </button>
      <div
        className="game-board"
        style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}
      >
        {arr.map((element, index) => (
          <Fragment key={index}>
            {element.map((item, indexItem) => (
              <div
                className={`border text-center align-content-center fw-bold fs-2 cell`}
                style={{ aspectRatio: "1 / 1" }}
                key={indexItem}
                onClick={() => handleClick(index, indexItem)}
              >
                {item}
              </div>
            ))}
          </Fragment>
        ))}
=======
import { useState } from "react";

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function calculateWinner(squares) {
  //the game can have a winner
  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (squares[a] !== "" && squares[a] === squares[b] && squares[b] === squares[c]) {
      return (squares[a]);
    }
  }
  // or the result is a draw
  return "";
}

function existEmptyCellOnTable(stateArray){
  return stateArray.filter((elem) => { return elem === "" }).length !== 0;
}

function calculateGameStatus(stateArray, currrentSymbol) {
  let isDraw = existEmptyCellOnTable(stateArray) === 0;
  let winner = calculateWinner(stateArray);
  let gameStatus;
  if (winner) gameStatus = `Player ${winner} won.`;
  else if (isDraw) gameStatus = "It's a draw";
  else gameStatus = `Next player : ${currrentSymbol}`;
  return gameStatus;
}

function GameBoard() {
  const [hoverCell, setHoverCell] = useState(-1);
  const [value, setValue] = useState("X");
  const [arr, setArr] = useState(Array(9).fill(""));

  function handleCellClick(index) {
    if (arr[index] || calculateWinner(arr)) return;
    else {
      // celula este libera
      // si bineinteles este randul nostru, al persoanei sa puna X
      if (value === "X") {
        setArr(arr.map((element, indexElem) => {
          if (index === indexElem) return value;
          return element;
        }))
      }
      setValue("O");
    }
  }

  function showComputerMove() {
    //calculatorul vrea sa puna O pe prima o pozitie random libera
    let firstRandomAvailabePosition = null;
    while (firstRandomAvailabePosition === null) {
      let randomPosition = Math.floor(Math.random() * 9) + 1;
      if (arr[randomPosition] === "") firstRandomAvailabePosition = randomPosition;
    }

    setArr(arr.map((element, indexElem) => {
      if (indexElem === firstRandomAvailabePosition) return value;
      return element;
    }))
    setValue("X");
  }

  if (value === "O" && !calculateWinner(arr) && existEmptyCellOnTable(arr)) {
    setTimeout(showComputerMove, 2000);
  };

  return (
    <>
      {(value === "O" && existEmptyCellOnTable(arr)) ? <div>Loading...</div> : null}
      <div className="container">
        {calculateGameStatus(arr, value)}
        <div className="row">
          {arr.map((element, index) => (
            <div
              className={`col-4 border text-center align-content-center fw-bold fs-1 cell ${hoverCell === index ? "border-dark" : "border-dark-subtlee"}`}
              onMouseEnter={() => setHoverCell(index)}
              onMouseLeave={() => setHoverCell(-1)}
              onClick={() => handleCellClick(index)}
              key={index}
              style={{ aspectRatio: "1 / 1" }}
            >
              {element}
            </div>
          ))}
        </div>
>>>>>>> bcef46f14d1d5b6b6987ec6c6558aa9f30eb38b2
      </div>
    </div>
  );
}

export default GameBoard;
