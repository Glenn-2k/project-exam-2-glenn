import { Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";
import VenueList from "./components/Venuelist";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SpecificVenue from "./components/SpecificVenue";
import Login from "./components/Login/login";

function RouteNotFound() {
  return <div>Page not found</div>;
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<VenueList />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<RouteNotFound />} />
            <Route path="/venues/:id" element={<SpecificVenue />} />
          </Route>
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
