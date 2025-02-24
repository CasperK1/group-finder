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
  const isDashboard = location.pathname === '/' || location.pathname.startsWith('/your-groups');
  const isAboutPage = location.pathname === '/about'; //  footer only on About page

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Layout */}
      <div className="flex flex-1 w-full bg-gradient-to-br from-gray-100 to-gray-200">
        {/* Sidebar for "groups" / "your groups" */}
        {isDashboard && (
          <aside className="w-64 min-w-[250px] p-4 hidden md:block">
            <Sidebar />
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-6 ${isDashboard ? "ml-64" : ""}`}>
          <Outlet />
        </main>
      </div>

      {/* Footer for about page */}
      {isAboutPage && (
        <footer className="w-full bg-white p-8 shadow-xl">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="text-gray-900 font-semibold text-lg transition duration-300 hover:text-blue-600 hover:translate-x-2">Phong</h4>
              <ul className="text-gray-600 text-md space-y-3 mt-3">
                <li className="transition duration-300 hover:text-blue-600 hover:translate-x-2">UI desing</li>
                <li className="transition duration-300 hover:text-blue-600 hover:translate-x-2">UX design</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold text-lg transition duration-300 hover:text-blue-600 hover:translate-x-2">Leevi</h4>
              <ul className="text-gray-600 text-md space-y-3 mt-3">
                <li className="transition duration-300 hover:text-blue-600 hover:translate-x-2">UI desing</li>
                <li className="transition duration-300 hover:text-blue-600 hover:translate-x-2">UX design</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold text-lg transition duration-300 hover:text-blue-600 hover:translate-x-2">Casper</h4>
              <ul className="text-gray-600 text-md space-y-3 mt-3">
                <li className="transition duration-300 hover:text-blue-600 hover:translate-x-2">Backend</li>
                <li className="transition duration-300 hover:text-blue-600 hover:translate-x-2">Backend</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold text-lg transition duration-300 hover:text-blue-600 hover:translate-x-2">Tino</h4>
              <ul className="text-gray-600 text-md space-y-3 mt-3">
                <li className="transition duration-300 hover:text-blue-600 hover:translate-x-2">Backend</li>
                <li className="transition duration-300 hover:text-blue-600 hover:translate-x-2">Backend</li>
              </ul>
            </div>
          </div>
        </footer>
      )}
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
        element:// (
          //<ProtectedRoute>
            <SettingsPage />,
          //</ProtectedRoute>
        //),
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
