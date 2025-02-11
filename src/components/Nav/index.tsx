import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const activeClassName = "text-gray-400 mb-4 md:mb-0";
const getNavLinkClass = (isActive: boolean) =>
  isActive
    ? `${activeClassName} mb-4 md:mb-0 font-montserrat`
    : "mb-4 md:mb-0 font-montserrat";

const NavLinks = ({
  isLoggedIn,
  handleLogout,
  closeMenu,
}: {
  isLoggedIn: boolean;
  handleLogout: () => void;
  closeMenu: () => void;
}) => {
  return (
    <>
      <NavLink
        className={({ isActive }) => getNavLinkClass(isActive)}
        to="/"
        onClick={closeMenu}
      >
        Venues
      </NavLink>
      {isLoggedIn && (
        <NavLink
          className={({ isActive }) => getNavLinkClass(isActive)}
          to="/profile"
          onClick={closeMenu}
        >
          Profile
        </NavLink>
      )}
      {isLoggedIn ? (
        <button
          className="text-white mb-4 md:mb-0 font-montserrat"
          onClick={handleLogout}
        >
          Log out
        </button>
      ) : (
        <NavLink
          className={({ isActive }) => getNavLinkClass(isActive)}
          to="/login"
          onClick={closeMenu}
        >
          Log in/Register
        </NavLink>
      )}
    </>
  );
};

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("token")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuthState = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("authChange", updateAuthState);

    return () => {
      window.removeEventListener("authChange", updateAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChange")); // Notify other components
    navigate("/login");
  };

  const toggleNavbar = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="flex items-center">
      {/* Desktop Navigation */}
      <nav className="w-full flex justify-end px-4 mr-6">
        <div className="hidden w-full md:flex justify-between items-center">
          <div className="flex space-x-4">
            <NavLinks
              isLoggedIn={isLoggedIn}
              handleLogout={handleLogout}
              closeMenu={() => {}}
            />
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleNavbar}
            className="text-xl relative flex justify-center items-center w-8 h-8"
          >
            <FaTimes
              className={`absolute transition-opacity transform ${
                isOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-45"
              } duration-300`}
            />
            <FaBars
              className={`absolute transition-opacity transform ${
                isOpen ? "opacity-0 -rotate-45" : "opacity-100 rotate-0"
              } duration-300`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-teal-950 shadow-md py-4 md:hidden z-50">
          <div className="flex flex-col items-center">
            <NavLinks
              isLoggedIn={isLoggedIn}
              handleLogout={handleLogout}
              closeMenu={closeMenu}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;
