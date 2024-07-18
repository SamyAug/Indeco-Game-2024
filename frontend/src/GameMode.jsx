/* eslint-disable react/prop-types */
import "./GameMode.css";

function GameMode({ onSelectMode }) {
  return (
    <div>
      <h1 className="text-center fw-bold text-danger">
        Welcome to Tic Tac Toe!
      </h1>
      <h3 className="text-center fw-bold text-danger">
        Please Select Your Game Mode
      </h3>
      <div className="container">
        <div className="row justify-content-evenly">
          <div className="col-7 col-sm-4 card mt-3">
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
                className="btn btn-primary"
                onClick={() => onSelectMode("singleplayer")}
              >
                Singleplayer
              </button>
            </div>
          </div>

          <div className="col-7 col-sm-4 card mt-3">
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
                className="btn btn-primary"
                onClick={() => onSelectMode("multiplayer")}
              >
                Multiplayer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameMode;
