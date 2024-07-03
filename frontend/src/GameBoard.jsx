// import React from 'react'
import { useState } from "react";
// import "./GameBoard.css";

function GameBoard() {
  const [borderColor, setBorderColor] = useState("border-dark-subtle");
  const [hoverCellIndex, setHoverCellIndex] = useState(0);
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  /**
   * TEMA: Se se faca hover la fiecare celula in parte, nu la tot
   */

  return (
    <>
      <div className="container">
        <div 
        className="row"
        onMouseEnter={() => {
          setBorderColor("border-dark")}}
        onMouseLeave={() => {
          setBorderColor("border-dark-subtle")
        }}
        >
          {arr.map((element,index) => (
            <div
              className={`col-4 border text-center align-content-center fw-bold fs-1 cell ${hoverCellIndex === index ? borderColor : ''}`}
              onMouseEnter={() => {
                setHoverCellIndex(index);
                }}
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
