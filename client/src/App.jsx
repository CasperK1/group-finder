import React from 'react';
import Onboard from './components/Onboard';
import Login from './page/Login';
import SignUp from './page/SignUp';
import Reset from './page/Reset';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Onboard />,
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
