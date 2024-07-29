import { ToastContainer } from "react-toastify";
import "./App.css";
import Weather from "./Components/Weather/Weather";

function App() {
  return (
    <div className="app">
      <Weather />
      <ToastContainer />
    </div>
  );
}

export default App;
