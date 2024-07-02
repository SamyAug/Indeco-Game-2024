// import React from 'react'
import { useState } from "react";
// import "./GameBoard.css";

function GameBoard() {
  const [borderColor, setBorderColor] = useState("border-dark-subtle");
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  /**
   * TEMA: Se se faca hover la fiecare celula in parte, nu la tot
   */

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
