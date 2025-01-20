import Logo from "../Logo";
import Nav from "../Nav";

const Header = () => {
  return (
    <header className="bg-teal-950 sticky top-0 flex-wrap z-[20] mx-auto w-full flex justify-between items-center text-white ">
      <Logo />
      <Nav />
    </header>
  );
};

export default Header;
