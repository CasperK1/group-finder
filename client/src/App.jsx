import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import Login from './page/Login';
import SignUp from './page/SignUp';
import Reset from './page/Reset';
import HeaderSection from './components/YourGroup/HeaderSection';
import GroupsList from './components/YourGroup/GroupsList';
import YourGroups from './page/YourGroups';
import AboutPage from './page/About';
import SettingsPage from './page/Settings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Layout Component for pages with Sidebar & Navbar
function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/"); // Show sidebar on dashboard pages

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-layout">
        {isDashboard && (
          <div className="main-container-1">
            <Sidebar />
          </div>
        )}
        <div className={isDashboard ? "main-container-2" : "full-width-container"}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// Define Routes
const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <Onboard />,
  // },
  {
    path: '/',
    element: <Layout />, 
    children: [
      {
        index: true, // Default child route
        element: (
          <>
            <HeaderSection />
            <GroupsList />
          </>
        ),
      },
      {
        path: 'your-groups',
        element: <YourGroups />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/reset',
    element: <Reset />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
