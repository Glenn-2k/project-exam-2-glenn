import logoWhite from "../assets/logoWhite.png";
import { useLocation, useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  return (
    <div>
      <img
        src={logoWhite}
        alt="Logo"
        className="h-12 w-auto m-4 pl-6 cursor-pointer"
        onClick={handleClick}
      />
    </div>
  );
};

export default Logo;
