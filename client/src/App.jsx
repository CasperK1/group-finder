import React from 'react';
import { AuthProvider } from './provider/AuthProvider';
import ProtectedRoute from './ProtectedRoute';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import Login from './page/Login';
import SignUp from './page/SignUp';
import Reset from './page/Reset';
import GroupsList from './components/YourGroup/GroupsList';
import YourGroups from './page/YourGroups';
import AboutPage from './page/About';
import SettingsPage from './page/Settings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import GroupInformation from './components/Group/GroupInformation';

function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/');

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-layout">
        {isDashboard && (
          <div className="main-container-1 mr-8">
            <Sidebar />
          </div>
        )}
        <div className={isDashboard ? 'main-container-2' : 'full-width-container'}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true, 
        element: (
          <>
            <GroupsList allGroup={true}/>
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
        element: (
          <ProtectedRoute>
            <SettingsPage />,
          </ProtectedRoute>
        ),
      },
      {
        path: 'group/:id',
        element: (
          <ProtectedRoute>
            <GroupInformation />
          </ProtectedRoute>
        ),
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
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
