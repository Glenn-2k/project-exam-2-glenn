import logoWhite from "../assets/logoWhite.png";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div>
      <img
        src={logoWhite}
        alt="Logo"
        className="h-12 w-auto m-4 pl-6 cursor-pointer"
        onClick={() => navigate("/")}
      />
    </div>
  );
};

export default Logo;
