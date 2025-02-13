import { loadLocal } from "./localStorage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (loadLocal("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return null;
};

export default Logout;
