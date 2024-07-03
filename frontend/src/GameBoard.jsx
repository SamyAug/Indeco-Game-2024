// import React from 'react'
import { useState } from "react";
// import "./GameBoard.css";

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

function GameBoard() {
  const [hoverCell, setHoverCell] = useState(-1);
  const [value, setValue] = useState("X");
  const [arr, setArr] = useState(["", "", "", "", "", "", "", "", ""]);
  const [gameStatus, setGameStatus] = useState("")

  function checkWinner() {
    winningCombos.forEach((winningCombo) => {
      const [ a, b, c ] = winningCombo
      if (arr[a] !== "" && arr[a] === arr[b] && arr[b] === arr[c]) {
        setGameStatus(arr[a])
      }
    })
  }
  
  function handleCellClick(index) {
    if (arr[index] === "") {
      setArr(arr.map((element, indexElem) => {
        if (index === indexElem) return value;
        return element;
      }))
      console.log(arr);
      
      setValue(value === "X" ? "O" : "X");
      checkWinner();
    }
  }
  return (
    <>
      <div className="container">
        {
          gameStatus !== "" &&
          (gameStatus === 'X' ?
            <div>
              Player 1 won
            </div> :
            <div>Player 2 won</div>)

        }
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
      </div>
    </>
  );
}

export default GameBoard;
