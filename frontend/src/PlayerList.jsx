import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./SocketContext";

const PlayerList = ({ userData, setGames }) => {
  const socket = useContext(SocketContext);
  const [userList, setUserList] = useState([]);
  const [userRelations, setUserRelations] = useState([]);
// console.log(userRelations)
  socket.onmessage = ({ data }) => {
    console.log("Data from PlayerList:", data);
    try {
      const { messageType, users, senderId, message } = JSON.parse(data);

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
          setGames((prevGames) => [...prevGames, opponentData]);
        }

        if (message.userRequestType === "declineRequest") {
          setUserRelations((prevRelations) =>
            prevRelations.filter((relation) => relation.userId !== senderId)
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
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

    if (relationStatus === 'playing'){
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
    setGames((prevGames) => [...prevGames, opponentData]);
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
        message: { userRequestType: "acceptRequest" },
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
    if (!userList.length)
      socket.send(JSON.stringify({ messageType: "userRefresh" }));
  }, []);

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
