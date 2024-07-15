import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "./SocketContext";
import { UserContext } from "./App";

const PlayerList = ({ setGames }) => {
  const { userData } = useContext(UserContext);
  const { socket, setMessageHandlers } = useContext(SocketContext)
  const [userList, setUserList] = useState([]);
  const [userRelations, setUserRelations] = useState([]);


  console.log("rendered playerlist")
  const playerListHandler = useCallback(({ messageType, users, senderId, message })=>{
      //{ messageType: "userRefresh", users }
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

          setUserRelations(
            userRelations.map((relation) => {
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
        console.log("In player list")
      }
    }
}, [userList, userRelations])

useEffect(() => {
  setMessageHandlers(prevHandlers => new Set([...prevHandlers, playerListHandler]))
  
  return () => {
    setMessageHandlers(prevHandlers => new Set([...prevHandlers].filter(handler => handler !== playerListHandler)))
  }
}, [playerListHandler])

  const calculateUserRelationStatus = (relationStatus, userId) => {
    if (relationStatus === "invited") {
      return (
        <>
          <button onClick={() => handleRequestAccept(userId)}>Accept</button>
          <button onClick={() => handleRequestDecline(userId)}>Decline</button>
        </>
      );
    }

    if (relationStatus === "inviting") {
      return <button disabled>Waiting...</button>;
    }

    if (relationStatus === "playing") {
      return <button disabled>Playing...</button>;
    }

    return (
      <button value={userId} onClick={handleSendInvite}>
        Invite to play
      </button>
    );
  };

  const handleSendInvite = (e) => {
    const { value: opponentId } = e.target;

    // { receivers, message }
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
  };

  const handleRequestAccept = (userId) => {
    const opponentData = userList.find((user) => user.userId === userId);
    const mySymbol = Math.random() > 0.5 ? "X" : "O";
    setGames((prevGames) => [
      ...prevGames,
      { ...opponentData, symbol: mySymbol },
    ]);
    setUserRelations(
      userRelations.map((relation) => {
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
  };

  const handleRequestDecline = (userId) => {
    setUserRelations((prevRelations) =>
      prevRelations.filter((relation) => relation.userId !== userId)
    );
    socket.send(
      JSON.stringify({
        receivers: [userId],
        message: { userRequestType: "declineRequest" },
      })
    );
  };

  useEffect(() => {

    // if (!userList.length)
      socket.send(JSON.stringify({ messageType: "userRefresh" }));
  }, [socket]);

  return (
    <>
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
