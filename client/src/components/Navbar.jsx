import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';
import { useSelector } from 'react-redux';
import logo from '../assets/Groupfinderlogo.png';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
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
    <nav className="w-full bg-white py-4 px-6 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Group Finder Logo" className="h-8 cursor-pointer" />
        </Link>

        {/* Hamburger Menu Button */}
        <button className="lg:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <span className="text-2xl">✖</span> : <span className="text-2xl">☰</span>}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex space-x-8">
          {['/', '/your-groups', '/about'].map((path, index) => (
            <li key={index} className="relative group">
              <Link
                to={path}
                className="text-gray-800 font-semibold hover:text-blue-500 transition duration-300"
              >
                {path === '/' ? 'Groups' : path === '/your-groups' ? 'Your Groups' : 'About'}
              </Link>
              <span className="absolute left-0 bottom-[-4px] h-1 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </li>
          ))}
        </ul>

        {/* User Section */}
        <div className="hidden lg:flex items-center space-x-3 bg-white p-2 rounded-lg hover:shadow-md transition">
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
      </div>

      {/* Mobile Navigation Menu with Tailwind Animation */}
      <div
        className={`lg:hidden absolute top-16 right-0 w-32 bg-white shadow-lg py-4 px-4 flex flex-col space-y-4 text-right z-50
        transition-all duration-300 ease-in-out transform ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-[-10px] pointer-events-none'
        }`}
      >
        <Link to="/" className="text-gray-800 font-semibold hover:text-blue-500" onClick={() => setIsOpen(false)}>
          Groups
        </Link>
        <Link to="/your-groups" className="text-gray-800 font-semibold hover:text-blue-500" onClick={() => setIsOpen(false)}>
          Your Groups
        </Link>
        <Link to="/about" className="text-gray-800 font-semibold hover:text-blue-500" onClick={() => setIsOpen(false)}>
          About
        </Link>

        {token !== null ? (
          <div className="flex flex-col items-end space-y-2">
            {/* Profile Block */}
            <div onClick={handleProfileClick} className="flex flex-col items-end cursor-pointer">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                <img
                  src={profilePicture}
                  alt={user ? `${user.firstName}'s profile` : 'Profile'}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-md font-semibold text-gray-900 mt-2">{user ? user.firstName : 'User'}</p>
            </div>

            {/* Logout */}
            <button onClick={handleLogoutClick} className="text-sm text-red-500 font-semibold">
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
