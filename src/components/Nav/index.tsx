import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const activeClassName = "text-gray-400 mb-4 md:mb-0";
const getNavLinkClass = (isActive: boolean) =>
  isActive
    ? `${activeClassName} mb-4 md:mb-0 font-montserrat`
    : "mb-4 md:mb-0 font-montserrat";

/**
 * NavLinks Component
 *
 * Displays navigation links for both logged-in and logged-out users.
 *
 * @component
 * @param {boolean} isLoggedIn - Indicates if the user is logged in.
 * @param {() => void} handleLogout - Function to handle user logout.
 * @param {() => void} closeMenu - Function to close the mobile menu.
 * @returns {JSX.Element} The rendered NavLinks component.
 */
const NavLinks = ({
  isLoggedIn,
  handleLogout,
  closeMenu,
}: {
  isLoggedIn: boolean;
  handleLogout: () => void;
  closeMenu: () => void;
}): JSX.Element => {
  return (
    <>
      <NavLink
        className={({ isActive }) => getNavLinkClass(isActive)}
        to="/"
        onClick={closeMenu}
        aria-label="Home"
      >
        Venues
      </NavLink>
      {isLoggedIn && (
        <NavLink
          className={({ isActive }) => getNavLinkClass(isActive)}
          to="/profile"
          onClick={closeMenu}
          aria-label="Profile"
        >
          Profile
        </NavLink>
      )}
      {isLoggedIn ? (
        <button
          aria-label="Log out"
          className="text-white mb-4 md:mb-0 font-montserrat"
          onClick={handleLogout}
        >
          Log out
        </button>
      ) : (
        <NavLink
          aria-label="Log in/Register"
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

/**
 * Nav Component
 *
 * Navigation bar with responsive mobile menu toggle and authentication state management.
 *
 * @component
 * @returns {JSX.Element} The rendered Nav component.
 */
const Nav = () => {
  /** State to track mobile menu open/close state */
  const [isOpen, setIsOpen] = useState(false);

  /** State to track if user is logged in */
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  const navigate = useNavigate();

  /**
   * Effect to listen for authentication state changes and update navigation.
   */
  useEffect(() => {
    const updateAuthState = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("authChange", updateAuthState);

    return () => {
      window.removeEventListener("authChange", updateAuthState);
    };
  }, []);

  /**
   * Handles user logout by removing the token and navigating to login page.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChange")); // Notify other components
    navigate("/login");
    closeMenu();
  };

  /** Toggles the mobile menu open/close state */
  const toggleNavbar = () => setIsOpen(!isOpen);

  /** Closes the mobile menu */
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
              aria-label="Navigation links"
            />
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Toggle mobile menu"
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
              aria-label="Mobile navigation links"
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
