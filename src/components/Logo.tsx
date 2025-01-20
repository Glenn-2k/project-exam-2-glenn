import logoWhite from "../assets/1.png";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div>
      <img
        src={logoWhite}
        alt="Logo"
        className="h-16 w-auto ml-4 cursor-pointer"
        onClick={() => navigate("/")}
      />
    </div>
  );
};

export default Logo;
