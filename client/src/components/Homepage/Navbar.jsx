import { Link } from "react-router-dom";
import logo from "../assets/Groupfinderlogo.png";
import "../index.css";

function Navbar() {
  return (
    <nav className="navbar full-width">
      <div className="logo-container">
        <img src={logo} alt="Group Finder Logo" className="logo-img" />
      </div>
      <ul className="nav-links">
        <li><Link to="/" className="nav-link">Groups</Link></li>
        <li><Link to="/your-groups" className="nav-link">Your Groups</Link></li>
        <li><Link to="/about" className="nav-link">About</Link></li>
      </ul>
      <Link to="/settings" className="user-button">👤 User/Settings</Link>
    </nav>
  );
}

export default Navbar;
