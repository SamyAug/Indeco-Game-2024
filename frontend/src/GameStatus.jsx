import PropTypes from "prop-types";
import "./css/GameStatus.css";

function GameStatus({
  status,
  handleSetStatus,
  statusOptions,
  handleSetPlayerSymbol,
}) {
  function handleClick() {
    const symbol = Math.random() < 0.5 ? "X" : "O";
    handleSetPlayerSymbol(symbol);
    handleSetStatus(statusOptions[symbol === "X" ? 1 : 2]);
  }

  return (
    <div className="d-flex justify-content-evenly justify-content-md-center mb-4">
      <h1
        className={`text-primary-emphasis ${
          status === statusOptions[0] || status === statusOptions[8]
            ? "vert-move"
            : ""
        }`}
      >
        {status}
      </h1>
      <button
        className={`btn btn-primary ${
          status !== statusOptions[0] && status !== statusOptions[8] && "d-none"
        }`}
        onClick={handleClick}
      >
        Start Game
      </button>
    </div>
  );
}

GameStatus.propTypes = {
  status: PropTypes.string,
  handleSetStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  handleSetPlayerSymbol: PropTypes.func,
};

export default GameStatus;
