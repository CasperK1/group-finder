import React from 'react';
import Form from '../components/Login/Form';
import SocialButtons from '../components/Login/SocialButtons';
import TermsAndConditions from '../components/Login/TermsAndConditions';
import logo from '../assets/Groupfinderlogo.png';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <>
     <nav className="flex justify-between items-center w-full bg-white py-4 px-6 shadow-md">
           <div className="flex items-center">
             <Link to="/">
               <img src={logo} alt="Group Finder Logo" className="h-8 cursor-pointer" />
             </Link>
           </div>
      </nav>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100" data-theme="light">
        <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md ">
          <h2 className="text-2xl font-bold mb-6 text-blue-600">Login</h2>
          <Form />
          <TermsAndConditions />
          <div className="text-center mt-6">
            <a href="/reset" className="text-blue-600">
              Forgot your password?
            </a>
          </div>
          <div className="text-center mt-2">
            <span className="text-gray-600">Don't have an account?</span>
            <a href="/signup" className="text-blue-600">
              Sign up
            </a>
          </div>
          <div className="flex items-center justify-center mt-6">
            <hr className="w-1/4 border-gray-300" />
            <span className="mx-2 text-gray-500">or</span>
            <hr className="w-1/4 border-gray-300" />
          </div>
          <SocialButtons />
        </div>
      </div>
    </>
  );
};

export default Login;
