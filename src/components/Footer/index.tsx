import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-teal-950 text-white w-full py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left px-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-semibold">Holidaze</h2>
          <p className="text-sm text-gray-300">
            © 2024 Glenn. All rights reserved.
          </p>
        </div>

        <nav className="flex gap-6 text-sm">
          <a href="#" className="hover:text-gray-300 transition">
            About
          </a>
          <a href="#" className="hover:text-gray-300 transition">
            Contact
          </a>
          <a href="#" className="hover:text-gray-300 transition">
            Terms
          </a>
        </nav>

        <div className="flex gap-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaXTwitter className="fab fa-github text-xl hover:text-gray-300 transition" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub className="fab fa-github text-xl hover:text-gray-300 transition" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
