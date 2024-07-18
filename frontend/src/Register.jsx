import { useContext, useState } from "react";
import { SocketContext } from "./SocketContext";
import { UserContext } from "./App";

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
export default function Register({ onRegister, onBackToMenu }) {
  const { setUserData } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  socket.onmessage = ({ data }) => {
    console.log("Socket message from Register: ", data);
    try {
      const parsedMessage = JSON.parse(data);

      if (parsedMessage.messageType === "authentication") {
        const userData = {
          userId: parsedMessage.userId,
          username: parsedMessage.username,
        };
        setUserData(userData);
        setErrorMessage("");
        onRegister(userData);
      }

      if (messageType === "registerError") setErrorMessage(message);
    } catch (err) {
      console.log(err);
      if (parsedMessage.messageType === "registerError")
        setErrorMessage(parsedMessage.message);
    } catch (err) {
      console.log(err);
    }
  });
  };

  const handleChange = (e) => {
    const { value } = e.target;

    setMessage(value);
  };
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

  return (
    <>
      <div
        className="container position-absolute top-50 start-50 translate-middle "
        style={{ width: "device-width" }}
      >
        {errorMessage && (
          <h2 className="text-center text-bg-danger text-wrap">
            {errorMessage}
          </h2>
        )}
        <div>
          <div className="wellcomeText text-center text-primary-emphasis mb-4 ">
            <h2>WELCOME TO GAME...</h2>
            <h4>please enter your username </h4>
          </div>
          <form className="text-center mb-3 d-grid gap-2 col-2 mx-auto" onSubmit={handleSubmit}>
            <input
              maxLength={"20"}
              minLength={"1"}
              className="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="addon-wrapping"
              type="text"
              value={message}
              onChange={handleChange}
            />
            <button
              className="btn btn-primary btn-lg "
              type="submit"
            >
              Submit
            </button>
           
          </form>
        </div>
        <img
          className="position-absolute top-20 start-50 translate-middle-x "
          style={{ width: "200px", height: "200px" }}
          src="https://ugokawaii.com/wp-content/uploads/2023/05/emphasis-up.gif"
        />
      </div>
      <div className=" text-dark position-absolute top-0 start-50 translate-middle-x fw-bold mt-4 rounded">
        <img
          className=" rounded"
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXk2bmI2ZGQ2ODJnYmRlbGxpdG52bm53ZWJ4dDBoMGNmZDR1anVkdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ld0EUCRYnRCdC6t0cZ/giphy.gif"
        />
      </div>
      <div>
        <img
          className="position-absolute bottom-0 start-0"
          style={{ width: "200px", height: "200px" }}
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHEybnFuanlqNGp4ZGVjbjBmbTM5N3gzYzl6NWV5cmVnazJrb2tsOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qAWWpdxRzQCFEVGbiJ/giphy.gif"
        />
        <img
          className="position-absolute top-0 end-0"
          style={{ width: "200px", height: "200px" }}
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHEybnFuanlqNGp4ZGVjbjBmbTM5N3gzYzl6NWV5cmVnazJrb2tsOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qAWWpdxRzQCFEVGbiJ/giphy.gif"
        />
        
      </div>
      <button  
           className="btn btn-dark w-40 md-3 position-absolute bottom-0 end-0 me-3 mb-3"
           onClick={onBackToMenu}
           > 
           Back to menu</button>
    </>
  );
}
