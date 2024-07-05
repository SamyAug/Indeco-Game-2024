import PropTypes from "prop-types";

function PlayerCard({ name, active, imageSrc = "", isWinner = false }) {
  return (
    <>
      <div
        className={`card border ${
          active ? "border-5 border-primary-subtle shadow-lg" : "border-gray"
        }`}
      >
        <img src={imageSrc} className="card-img-top pe-none" alt="..." />
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">
            Hi! I&apos;m {name} and I will win this round!
          </p>
        </div>
      </div>
      {isWinner && (
        <div className="container mt-2">
          <div className="row">
            <div className="col text-center">
              <div className="spinner-grow text-danger" role="status">⭐</div>
            </div>
            <div className="col text-center">
              <div className="spinner-grow text-success" role="status">⭐</div>
            </div>
            <div className="col text-center">
              <div className="spinner-grow text-warning" role="status">⭐</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

PlayerCard.propTypes = {
  name: PropTypes.string,
  active: PropTypes.bool,
  imageSrc: PropTypes.string,
  isWinner: PropTypes.bool,
};

export default PlayerCard;
