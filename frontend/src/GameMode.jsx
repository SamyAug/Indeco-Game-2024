import React from "react";
import  "./GameMode.css"

function GameMode({ onSelectMode }) {
  return (
    <div>
      <h1 className="text-center fw-bold text-danger"> Welcome to Tic Tac Toe!</h1>
      <h3 className="text-center fw-bold text-danger">Please Select Your Game Mode</h3>
      <div className="d-flex justify-content-center position-absolute top-50 start-50 translate-middle">
        <div className="card m-2 me-3" style={{ width: "18rem" }}>
          <img
            src="https://media0.giphy.com/media/JsE9qckiYyVClQ5bY2/giphy.gif?cid=6c09b952t9pmpruol4hnbnge9mgc4z1k5w11ie07c3k5m3ax&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g"
            className="card-img-top"
            alt="Singleplayer"
          />
          <div className="card-body">
            <h5 className="card-title">Singleplayer</h5>
            <p className="card-text">
              Joacă împreună cu calculatorul și încearcă să îl bați!
            </p>
            <button
              className="btn btn-primary btn-lg me-3"
              onClick={() => onSelectMode('singleplayer')}
            >
              Singleplayer
            </button>
          </div>
        </div>

        <div className="card m-2 md-3 " style={{ width: "18rem" }}>
          <img
            src="https://media2.giphy.com/media/n6mEMqAuYOQ8l8qcEE/200w.gif?cid=6c09b952vleytkqpad4dp0sougdbkl9dzgxtjta1s6bjg7sl&ep=v1_gifs_search&rid=200w.gif&ct=g"
            className="card-img-top"
            alt="Multiplayer"
          />
          <div className="card-body">
            <h5 className="card-title">Multiplayer</h5>
            <p className="card-text">
              Joacă împreună cu alți jucători și încearcă să fii cel mai bun!
            </p>
            <button
              className="btn btn-primary btn-lg me-3"
              onClick={() => onSelectMode('multiplayer')}
            >
              Multiplayer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameMode;
