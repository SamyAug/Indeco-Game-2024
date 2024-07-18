import { useState, useContext } from "react";
import "./GameBoard.css";
import { SocketContext } from "./SocketContext";
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
function MultiplayerGameBoard({
  setGameStatus,
  setShowLoading,
  gameStatus,
  gameData,
}) {
  const [value, setValue] = useState("X");
  const [mySymbol, setMySymbol] = useState("");
  const [arr, setArr] = useState(Array(9).fill(""));
  const [isGameOver, setIsGameOver] = useState(false);

  const socket = useContext(SocketContext);

  if (gameData && gameData.symbol && !mySymbol) {
    console.log(gameData.symbol);
    setMySymbol(gameData.symbol);

    // setGameStatus(calculateGameStatus(arr, value));
    // setShowLoading(gameData.symbol !== value);
  }

  socket.onmessage = ({ data }) => {
    try {
      const { senderId, message } = JSON.parse(data);
      if (senderId === gameData.userId && message?.gameArray) {
        setArr([...message.gameArray]);
        const gameOver = verifyGameOver(message.gameArray);
        let newValue;
        if (!isGameOver) {
          newValue = flipValue();
          setValue(newValue);
        } else {
          newValue = value;
        }
        setIsGameOver(gameOver);
        setGameStatus(calculateGameStatus(message.gameArray, newValue));
        setShowLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function handleCellClick(index) {
    if (arr[index] || calculateWinner(arr)) {
      return;
    } else {
      executeGameMove(index);
    }
  }

  function flipValue() {
    return value === "X" ? "O" : "X";
  }

  function executeGameMove(index) {
    let newArrayState = arr.map((element, indexElem) => {
      if (index === indexElem) return value;
      return element;
    });
    let newValue;
    if (!isGameOver) {
      newValue = flipValue();
      setValue(newValue);
    } else {
      newValue = value;
    }

    setArr(newArrayState);
    setGameStatus(calculateGameStatus(newArrayState, newValue));
    setShowLoading(newValue !== mySymbol && !isGameOver);
    setIsGameOver(verifyGameOver(newArrayState));
    socket.send(
      JSON.stringify({
        receivers: [gameData.userId],
        message: { gameArray: newArrayState },
      })
    );
  }

  function calculateGameStatus(newArray, newValue) {
    let winner = calculateWinner(newArray).winner;
    if (winner) {
      return `Player ${winner} won`;
    } else if (existEmptyCellsOnTable(newArray) === false) {
      return "It's a draw";
    }
    if (newValue === mySymbol) {
      return `You move`;
    } else {
      return ``;
    }
  }

  function resetGame() {
    setValue("X");
    const resetedArray = Array(9).fill("");
    setArr(resetedArray);
    setMySymbol(newSymbol);
    setIsGameOver(false);
    setGameStatus(calculateGameStatus(resetedArray, "X"));
    setShowLoading(newSymbol !== "X");
  }

  function verifyGameOver(newArray) {
    const winner = calculateWinner(newArray).winner;
    // daca am castigator sau tabla nu mai este goala, s-a sfarsit jocul
    return winner || !existEmptyCellsOnTable(newArray);
  }

  return (
    <>
      <div className="container">
        <div className="row border border-5 border-primary-subtle">
          {arr.map((element, index) => (
            <div
              className={`col-4 text-center align-content-center fw-bold fs-1 user-select-none
                ${
                  value !== mySymbol || isGameOver
                    ? "not-ready pe-none"
                    : "cell"
                }
                ${
                  calculateWinner(arr)?.winningCombo?.includes(index)
                    ? "bg-success text-light"
                    : !arr.includes("") && gameStatus === "It's a draw"
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

      <div className={`text-center mt-3 ${!isGameOver ? "d-none" : ""}`}>
        <button className="btn btn-warning w-50" onClick={resetGame}>
          Joc nou
        </button>
      </div>
    </>
  );
}

export default MultiplayerGameBoard;
