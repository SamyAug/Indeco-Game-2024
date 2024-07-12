// eslint-disable-next-line react/prop-types
function GameStatus({opponentData, statusMessage, showLoading }) {
  
  return (
    <div className="d-flex justify-content-between">
      <h5 className="me-5">{statusMessage}</h5>
      <div className={`d-flex ${!showLoading ? "visually-hidden" : ""}`}>
        <span>Waiting for {opponentData.username} ...</span>
        <div className="spinner-border text-secondary ms-3" role="status"></div>
      </div>
    </div>
  );
}

export default GameStatus;
