import { Link } from 'react-router-dom';
import { useContext } from 'react';
import logo from '../assets/Groupfinderlogo.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';
import { useDispatch, useSelector } from 'react-redux';

function Navbar() {
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { profilePicture } = useSelector((state) => state.profilePicture);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/settings');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center w-full bg-white py-4 px-6 shadow-md">
      <div className="flex items-center">
        <img src={logo} alt="Group Finder Logo" className="h-8" />
      </div>

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

      <div className="flex items-center space-x-3 bg-white p-2 rounded-lg hover:shadow-md transition">
        {token !== null ? (
          <div className="group flex items-center">
            <div onClick={handleProfileClick} className="flex items-center cursor-pointer">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                <img
                  src={profilePicture}
                  alt={user ? `${user.firstName}'s profile` : 'Profile'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-right ml-3">
                <p className="text-sm text-gray-600">Hello!</p>
                <p className="text-md font-semibold text-gray-900">{user ? user.firstName : 'User'}</p>
              </div>
            </div>
            <button
              onClick={handleLogoutClick}
              className="ml-4 text-sm text-gray-500 hover:text-red-500 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLoginClick}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
