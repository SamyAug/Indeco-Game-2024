import { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "./App";
import { useSocket } from "./useSocket";

const PlayerList = ({ setGames, userRelations , setUserRelations }) => {
  const { userData } = useContext(UserContext);
  const [userList, setUserList] = useState([]);
  const socket = useSocket(({ messageType, users, senderId, message }) => {
    try {
      if (messageType === "userRefresh") {
        setUserList(users);
      } else if (senderId && message) {
        if (message.userRequestType === "joinRequest") {
          setUserRelations((prevRequests) => [
            ...prevRequests,
            { userId: senderId, relationStatus: "invited" },
          ]);
        }

        if (message.userRequestType === "acceptRequest") {
          const opponentData = userList.find(
            (user) => user.userId === senderId
          );
          setUserRelations((prevRelations) =>
            prevRelations.map((relation) => {
              if (relation.userId === senderId)
                return { ...relation, relationStatus: "playing" };
              return relation;
            })
          );
          setGames((prevGames) => [
            ...prevGames,
            { ...opponentData, symbol: message.symbol === "X" ? "O" : "X" },
          ]);
        }
        if (message.userRequestType === "declineRequest") {
          setUserRelations((prevRelations) =>
            prevRelations.filter((relation) => relation.userId !== senderId)
          );
          setGames((prevGames) =>
            prevGames.filter((game) => senderId !== game.userId)
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  const calculateUserRelationStatus = (relationStatus, userId) => {
    if (relationStatus === "invited") {
      return (
        <>
          <button className="btn btn-success ms-3 me-3 mt-3" onClick={() => handleRequestAccept(userId)}>Accept</button>
          <button className="btn btn-danger mt-3" onClick={() => handleRequestDecline(userId)}>Decline</button>
        </>
      );
    }

    if (relationStatus === "inviting") {
      return <button className="btn btn-info ms-3 mt-3" disabled>Waiting...</button>;
    }

    if (relationStatus === "playing") {
      return <button className="btn btn-info ms-3 mt-3" disabled>Playing...</button>;
    }

    return (
      <button  className="btn btn-primary ms-3 mt-3" value={userId} onClick={handleSendInvite}>
        Invite to play
      </button>
    );
  };

  const handleSendInvite = useCallback((e) => {
    const { value: opponentId } = e.target;
    socket.send(
      JSON.stringify({
        receivers: [opponentId],
        message: { userRequestType: "joinRequest" },
      })
    );
    setUserRelations((prevRelations) => [
      ...prevRelations,
      { userId: opponentId, relationStatus: "inviting" },
    ]);
  }, [socket, setUserRelations]);

  const handleRequestAccept = useCallback((userId) => {
    const opponentData = userList.find((user) => user.userId === userId);
    const mySymbol = Math.random() > 0.5 ? "X" : "O";
    setGames((prevGames) => [
      ...prevGames,
      { ...opponentData, symbol: mySymbol },
    ]);
    setUserRelations((prevRelations) =>
      prevRelations.map((relation) => {
        if (relation.userId === userId)
          return { ...relation, relationStatus: "playing" };
        return relation;
      })
    );
    socket.send(
      JSON.stringify({
        receivers: [userId],
        message: { userRequestType: "acceptRequest", symbol: mySymbol },
      })
    );
  }, [userList, setGames, setUserRelations, socket]);

  const handleRequestDecline = useCallback((userId) => {
    setUserRelations((prevRelations) =>
      prevRelations.filter((relation) => relation.userId !== userId)
    );
    socket.send(
      JSON.stringify({
        receivers: [userId],
        message: { userRequestType: "declineRequest" },
      })
    );
  }, [setUserRelations, socket]);

  useEffect(() => {
    socket.send(JSON.stringify({ messageType: "userRefresh" }));
  }, [socket]);

  return (
  
       <ul>
        {userList.map((user) => {
          const userRelation = userRelations.find(
            (relation) => relation.userId === user.userId
          );
          return (
            <li key={user.userId}>
              {user.username}
              {user.userId !== userData.userId &&
                calculateUserRelationStatus(
                  userRelation?.relationStatus,
                  user.userId
                )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default PlayerList;
