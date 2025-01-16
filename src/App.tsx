import { Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";

function App() {
  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={<Layout />} />
      </Routes>
    </div>
  );
}

export default App;
