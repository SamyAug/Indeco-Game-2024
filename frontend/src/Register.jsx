import { useContext, useEffect, useState, useCallback } from "react";
import { SocketContext } from "./SocketContext";
import { UserContext } from "./App";

export default function Register() {
  const { setUserData } = useContext(UserContext);
  const { socket, setMessageHandlers } = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const registerHandler = useCallback(({ messageType, userId, username, message }) => {
      if (messageType === "authentication") {
        setUserData({
          userId: userId,
          username: username,
        });
        setErrorMessage("");
      }

      if (messageType === "registerError")
        setErrorMessage(message);
  }, [])

  useEffect(() => {
    setMessageHandlers(prevHandlers => new Set([...prevHandlers, registerHandler]))
  }, [])

  const handleChange = (e) => {
    const { value } = e.target;

    setMessage(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    socket.send(
      JSON.stringify({ messageType: "authentication", registerAs: message })
    );
  };

  return (
    <>
      {errorMessage && <h1>{errorMessage}</h1>}
      <div>
        <form>
          <input type="text" value={message} onChange={handleChange} />
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
