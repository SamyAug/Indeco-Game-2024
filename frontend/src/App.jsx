import Register from "./Register";
import SocketContextProvider from "./SocketContextProvider";

function App() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-md-center">
        <div className="col-6">
          <SocketContextProvider>
            <Register />
          </SocketContextProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
