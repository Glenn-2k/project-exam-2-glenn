import Logo from "../Logo";
import Nav from "../Nav";
import SignInButton from "../SignInButton";

const Header = () => {
  return (
    <header className="bg-teal-950 sticky top-0 flex-wrap z-[20] mx-auto w-full flex justify-between items-center text-white ">
      <Logo />
      <Nav />
      <SignInButton />
    </header>
  );
};

export default Header;
