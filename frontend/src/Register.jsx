/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { UserContext } from "./App";
import { useSocket } from "./useSocket";

/**
 * TEMA: Sa arate bine interfata si pe PC si pe mobil
 */
export default function Register({ onRegister, onBackToMenu }) {
  const { setUserData } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const socket = useSocket(({ messageType, message, userId, username }) => {
    try {
      if (messageType === "authentication") {
        const userData = {
          userId: userId,
          username: username,
        };
        setUserData(userData);
        setErrorMessage("");
        onRegister(userData);
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
      <div className="container">
        {errorMessage && (
          <h2 className="text-center text-bg-danger text-wrap">
            {errorMessage}
          </h2>
        )}
        <div className="row">
          <div className="col-12 text-dark fw-bold mt-4">
            <img
              className="rounded w-100"
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXk2bmI2ZGQ2ODJnYmRlbGxpdG52bm53ZWJ4dDBoMGNmZDR1anVkdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ld0EUCRYnRCdC6t0cZ/giphy.gif"
            />
            <img
              className="rounded w-25"
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHEybnFuanlqNGp4ZGVjbjBmbTM5N3gzYzl6NWV5cmVnazJrb2tsOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qAWWpdxRzQCFEVGbiJ/giphy.gif"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 wellcomeText text-center text-primary-emphasis mb-4 ">
            <h2>WELCOME TO GAME...</h2>
            <h4>please enter your username </h4>
          </div>
          <div className="col-12">
            <form className="text-center mb-3 d-flex" onSubmit={handleSubmit}>
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
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </form>
            <img
              className="float-end rounded w-25"
              src="https://ugokawaii.com/wp-content/uploads/2023/05/emphasis-up.gif"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <button
              className="btn btn-dark md-3 me-3 mb-3 text-center"
              onClick={onBackToMenu}
            >
              Back to menu
            </button>
          </div>
          <div className="col-6">
            <img
              className="w-25 float-end"
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHEybnFuanlqNGp4ZGVjbjBmbTM5N3gzYzl6NWV5cmVnazJrb2tsOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qAWWpdxRzQCFEVGbiJ/giphy.gif"
            />
          </div>
        </div>
      </div>
    </>
  );
}
