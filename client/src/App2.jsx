import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import YourGroupsPage from "./page/YourGroups";
import AboutPage from "./About";
import SettingsPage from "./Settings";
import Navbar from "./components/Navbar"; 
import HeaderSection from "./components/HeaderSection"; 
import GroupsList from "./components/GroupsList"; 
import Sidebar from "./components/Sidebar"; 
import "./index.css";

function Layout() {
  const location = useLocation();
  const isGroupsPage = location.pathname === "/";   // Sidebar only on "/"

  return (
    <div className="app-container">
      <Navbar />

      <div className="content-layout">
        {/* Render Sidebar ONLY on the Groups Page */}
        {isGroupsPage && (
          <div className="main-container-1">
            <Sidebar />
          </div>
        )}

        {/* Adjust Main Container Width Dynamically */}
        <div className={isGroupsPage ? "main-container-2" : "full-width-container"}>
          <Routes>
            <Route path="/" element={<><HeaderSection /><GroupsList /></>} />
            <Route path="/your-groups" element={<YourGroupsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App2() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
