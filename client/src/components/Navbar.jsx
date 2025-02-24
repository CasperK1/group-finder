import { Link } from "react-router-dom";
import logo from "../assets/Groupfinderlogo.png";

function Navbar() {
  return (
    <nav className="flex justify-between items-center w-full bg-white py-4 px-6 shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Group Finder Logo"/>
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-8">
        <li>
          <Link 
            to="/" 
            className="relative text-gray-800 font-semibold hover:text-blue-500 transition duration-300 
                       before:absolute before:bottom-[-4px] before:left-0 before:w-0 before:h-1 before:bg-blue-500 
                       before:transition-all before:duration-300 hover:before:w-full"
          >
            Groups
          </Link>
        </li>
        <li>
          <Link 
            to="/your-groups" 
            className="relative text-gray-800 font-semibold hover:text-blue-500 transition duration-300 
                       before:absolute before:bottom-[-4px] before:left-0 before:w-0 before:h-1 before:bg-blue-500 
                       before:transition-all before:duration-300 hover:before:w-full"
          >
            Your Groups
          </Link>
        </li>
        <li>
          <Link 
            to="/about" 
            className="relative text-gray-800 font-semibold hover:text-blue-500 transition duration-300 
                       before:absolute before:bottom-[-4px] before:left-0 before:w-0 before:h-1 before:bg-blue-500 
                       before:transition-all before:duration-300 hover:before:w-full"
          >
            About
          </Link>
        </li>
      </ul>

      {/* User Settings Button */}
      <Link 
        to="/settings" 
        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
      >
        👤 User/Settings
      </Link>
    </nav>
  );
}

export default Navbar;
