import { Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";

function RouteNotFound() {
  return <div>Page not found</div>;
}

function App() {
  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="*" element={<RouteNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
