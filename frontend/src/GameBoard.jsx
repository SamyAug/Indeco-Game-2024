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
        <div className="row">
          {arr.map((element) => (
            <div
              className={`col-4 border text-center align-content-center fw-bold fs-1 cell ${borderColor}`}
              onMouseEnter={() => setBorderColor("border-dark")}
              onMouseLeave={() => setBorderColor("border-dark-subtle")}
              key={element}
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
