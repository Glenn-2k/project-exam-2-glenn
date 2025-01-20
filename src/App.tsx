import { Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";
import VenueList from "./components/Landingpage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function RouteNotFound() {
  return <div>Page not found</div>;
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen">
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route index element={<VenueList />} />
          <Route path="*" element={<RouteNotFound />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
