// eslint-disable-next-line react/prop-types
function PlayerCard({playerName, imageUrl}) {
  return (
    <div className="card">
      <img
        src={imageUrl}
        className="card-img-top"
        alt="..."
      />
      <div className="card-body">
        <h5 className="card-title">{playerName}</h5>
        <p>Sunt {playerName} si voi castiga!</p>
      </div>
    </div>
  );
}

export default PlayerCard;
