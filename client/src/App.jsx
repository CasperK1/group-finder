import React, { useEffect } from 'react';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { useDispatch } from 'react-redux';
import { apiService } from './services/api/apiService';
import { setProfilePicture } from './redux/reducer/profilePictureSlice';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Login from './page/Login';
import Reset from './page/Reset';
import SignUp from './page/SignUp';
import AboutPage from './page/About';
import YourGroups from './page/YourGroups';
import SettingsPage from './page/Settings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import GroupsList from './components/YourGroup/GroupsList';
import GroupInformation from './components/Group/GroupInformation';
import { AuthProvider } from './provider/AuthProvider';

function Layout() {
  const token = localStorage.getItem('jwtToken');
  const user = JSON.parse(localStorage.getItem('user'));

  const location = useLocation();
  const dispatch = useDispatch();

  const isAboutPage = location.pathname === '/about';
  const isDashboard = location.pathname === '/' || location.pathname.startsWith('/your-groups');

  useEffect(() => {
    const fetchUserProfilePicture = async () => {
      try {
        const response = await apiService.file.getProfilePicture({
          token: token,
          userId: user?.userId,
        });
        if (!response) {
          return;
        }
        dispatch(setProfilePicture(response.photoUrl));
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    if (token && user) fetchUserProfilePicture();
  }, [token, user, dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-black-500" data-theme="light">
      <Navbar />
      <div className="flex flex-1 w-full bg-gradient-to-br from-base-100 to-base-200">
        {isDashboard && (
          <aside className=" p-6 hidden md:block">
            <Sidebar />
          </aside>
        )}

        <main className={`flex-1 p-4 md:p-6 ${isDashboard ? 'md:ml-10' : ''} max-w-7xl mx-auto`}>
          <Outlet />
        </main>
      </div>

      {isAboutPage && (
        <footer className="w-full bg-gray-200 p-8 shadow-inner border-t border-base-300">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <h4 className="text-lg font-bold text-base-content mb-4 hover:text-primary transition-colors duration-300">
                Phong
              </h4>
              <ul className="text-base-content/80 space-y-2">
                <li className="hover:text-primary hover:translate-x-1 transition-all duration-300">UI Design</li>
                <li className="hover:text-primary hover:translate-x-1 transition-all duration-300">UX Design</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-base-content mb-4 hover:text-primary transition-colors duration-300">
                Leevi
              </h4>
              <ul className="text-base-content/80 space-y-2">
                <li className="hover:text-primary hover:translate-x-1 transition-all duration-300">UI Design</li>
                <li className="hover:text-primary hover:translate-x-1 transition-all duration-300">UX Design</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-base-content mb-4 hover:text-primary transition-colors duration-300">
                Casper
              </h4>
              <ul className="text-base-content/80 space-y-2">
                <li className="hover:text-primary hover:translate-x-1 transition-all duration-300">Backend</li>
                <li className="hover:text-primary hover:translate-x-1 transition-all duration-300">Backend</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-base-content mb-4 hover:text-primary transition-colors duration-300">
                Tino
              </h4>
              <ul className="text-base-content/80 space-y-2">
                <li className="hover:text-primary hover:translate-x-1 transition-all duration-300">Backend</li>
                <li className="hover:text-primary hover:translate-x-1 transition-all duration-300">Backend</li>
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
        element: <GroupsList allGroup={true} />,
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
      {
        path: 'group/:id',
        element: <GroupInformation />,
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
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer/>
      </AuthProvider>
    </Provider>
  );
}

export default App;