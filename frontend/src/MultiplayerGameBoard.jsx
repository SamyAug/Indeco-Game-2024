import { useState, useRef, useEffect, useCallback } from "react";
import "./GameBoard.css";
import Modal from "./Modal";
import { useSocket } from "./useSocket";
import { afkTime,emptyGameBoardDimension,winningCombos } from "./constant";



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
  setGames,
  setUserRelations,
  timeCounter,
  setTimeCounter
}) {
  const [value, setValue] = useState("X");
  const [mySymbol, setMySymbol] = useState("");
  const [arr, setArr] = useState(Array(emptyGameBoardDimension).fill(""));
  const [isGameOver, setIsGameOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timeOutRef = useRef(null)

  const socket = useSocket(({ senderId, message }) => {
    console.log("gameboard use socket");
    try {
      if (senderId === gameData.userId && message?.gameArray) {
        clearTimeout(timeOutRef.current)
        setArr([...message.gameArray]);
        const gameOver = verifyGameOver(message.gameArray);
          // timeOutRef.current = setTimeout(()=>{handleDecline();
          //   alert("Time out")
          // },afkTime)
        
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
      } else if (
        senderId === gameData.userId &&
        message.userRequestType === "reset"
      ) {
        setIsOpen(true);
      } else if (
        senderId == gameData.userId &&
        message.userRequestType === "acceptReset"
      ) {
        if(timeOutRef.current){
          clearTimeout(timeOutRef.current)
        }
        setValue("X");
        const newSymbol = message.symbol === "X" ? "O" : "X";
        setMySymbol(newSymbol);
        const newArray = Array(emptyGameBoardDimension).fill("");
        setArr(newArray);
        setGameStatus(calculateGameStatus(newArray, "X", newSymbol));
        setShowLoading(newSymbol !== "X");
        setIsGameOver(false);
      }
    } catch (error) {
      console.log(error);
    }
  });

  // useEffect(() => {
  //   timeOutRef.current = setTimeout(()=>{handleDecline();
  //     alert("Time out")
      
  //   }, afkTime)
  // }, [])

  if (gameData && gameData.symbol && !mySymbol) {
    console.log(gameData.symbol);
    setMySymbol(gameData.symbol);

    // setGameStatus(calculateGameStatus(arr, value));
    // setShowLoading(gameData.symbol !== value);
  }

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

  const timeCounterInterval = useCallback(() => {
      if(timeCounter <= 0){
        console.log("Entered timecounter if")
        clearInterval(timeOutRef.current)
        handleDecline()
        setTimeCounter(afkTime / 1000)
      } else {
        setTimeCounter((prevCounter) => prevCounter - 1)
      }
  }, [timeCounter])

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

    clearTimeout(timeOutRef.current)

    const gameOver = verifyGameOver(newArrayState);
    setArr(newArrayState);
    setGameStatus(calculateGameStatus(newArrayState, newValue));
    setShowLoading(newValue !== mySymbol && !gameOver);
    setIsGameOver(gameOver);
    socket.send(
      JSON.stringify({
        receivers: [gameData.userId],
        message: { gameArray: newArrayState },
      })
    );
   
      // timeOutRef.current = setTimeout(()=>{handleDecline();
      //   alert("Time out")
        
      // }, afkTime)
      timeOutRef.current = setInterval(timeCounterInterval, 1000)
    }
  
    
  function calculateGameStatus(newArray, newValue, myNewSymbol) {
    let winner = calculateWinner(newArray).winner;
    if (winner) {
      return `Player ${winner} won`;
    } else if (existEmptyCellsOnTable(newArray) === false) {
      return "It's a draw";
    }
    if (newValue === (myNewSymbol || mySymbol)) {
      return `You move with ${(myNewSymbol || mySymbol)}`;
    } else {
      return ``;
    }
  }

  //   function resetGame() {
  //     setValue("X");
  //     setArr(resetedArray);
  //     setMySymbol(newSymbol);
  //     setIsGameOver(false);
  //     setGameStatus(calculateGameStatus(resetedArray, "X"));
  //     setShowLoading(newSymbol !== "X");
  //   }

  function handleAccept() {
    clearTimeout(timeOutRef.current)
    setIsOpen(false);
    const newSymbol = Math.random() > 0.5 ? "X" : "O";
    setValue("X");
    setMySymbol(newSymbol);
    const resetedArray = Array(emptyGameBoardDimension).fill("");
    setArr(resetedArray);
    setIsGameOver(false);
    setGameStatus(calculateGameStatus(resetedArray, "X", newSymbol));
    setShowLoading(newSymbol !== "X");
    

    socket.send(
      JSON.stringify({
        receivers: [gameData.userId],
        message: { userRequestType: "acceptReset", symbol: newSymbol },
      })
    );
  }

  function handleDecline() {
    clearTimeout(timeOutRef.current)
    setIsOpen(false);
    setGames((prevGames) =>
      prevGames.filter((game) => game.userId !== gameData.userId)
    );
    setUserRelations((prevRelations) =>
      prevRelations.filter((relation) => relation.userId !== gameData.userId)
    );
    socket.send(
      JSON.stringify({
        receivers: [gameData.userId],
        message: { userRequestType: "declineRequest" },
      })
    );
  }

  function verifyGameOver(newArray) {
    const winner = calculateWinner(newArray).winner;
    // daca am castigator sau tabla nu mai este goala, s-a sfarsit jocul
    return winner || !existEmptyCellsOnTable(newArray);

  }

  function sendResetRequest() {
    clearTimeout(timeOutRef.current)
    setShowLoading(true)
    socket.send(
      JSON.stringify({
        receivers: [gameData.userId],
        message: { userRequestType: "reset" },
      })
    );
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
        <button className="btn btn-warning w-25 me-3" onClick={sendResetRequest} >
          New Game
        </button>
        <button className="btn btn-dark w-25 md-3" onClick={handleDecline}>
          Leave Game
        </button>
      </div>


      {isOpen && (
        <Modal title="Rematch" onClose={handleDecline} onAccept={handleAccept}>
          <div>{gameData.username} wants to play again</div>
        </Modal>
      )}
    </>
  );
}

export default MultiplayerGameBoard;