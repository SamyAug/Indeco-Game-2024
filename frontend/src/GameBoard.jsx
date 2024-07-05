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
      </div>
    </div>
  );
}

export default GameBoard;
