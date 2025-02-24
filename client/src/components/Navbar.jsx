import { Link } from "react-router-dom";
import logo from "../assets/Groupfinderlogo.png";

function Navbar() {
  //  Still has placeholder User Data 
  const user = {
    displayName: "Ben Dover", 
    photoURL: "https://via.placeholder.com/50", 
  };

  return (
    <nav className="flex justify-between items-center w-full bg-white py-4 px-6 shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Group Finder Logo" />
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

      {/* User Profile Section */}
      <Link to="/settings" className="flex items-center space-x-3 bg-white p-2 rounded-lg hover:shadow-md transition">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
          <img src={user.photoURL} alt="User Profile" className="w-full h-full object-cover" />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Hello!</p>
          <p className="text-md font-semibold text-gray-900">{user.displayName}</p>
        </div>
      </Link>
    </nav>
  );
}

export default Navbar;
