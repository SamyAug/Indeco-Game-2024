import { cloneElement, useState } from "react";

function GameBoard() {
  const [borderColor, setBorderColor] = useState("border-dark-subtle");
  const [hoveredCell, setHoveredCell] =useState(null)
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];


  const handleMouseEnter=(index)=>{
    setHoveredCell(index)
  }
  const handleMouseLeave=()=>{
    setHoveredCell()
  }


  return (
    <>
      <div className="container">
        <div className="row">
          {arr.map((index) => (
            <div
              
              className={`col-4 border text-center align-content-center fw-bold fs-1 ${hoveredCell === index ? 'border-dark': 'border-dark-subtlee' }` }
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
             
              style={{ aspectRatio: 1 / 1 }}
            >
            
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default GameBoard;
