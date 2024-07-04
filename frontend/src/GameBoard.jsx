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
      </div>
    </>
  );
}

export default GameBoard;
