import { useContext, useState } from "react";
import { SocketContext } from "./SocketContext";
import { UserContext } from "./App";
import { useSocket } from "./useSocket";

export default function Register() {
  const { setUserData } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const socket = useSocket(({ messageType, message, userId, username }) => {
    try {
      if (messageType === "authentication") {
        setUserData({
          userId: userId,
          username: username,
        });
        setErrorMessage("");
      }

      if (messageType === "registerError") setErrorMessage(message);
    } catch (err) {
      console.log(err);
    }
  });

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
