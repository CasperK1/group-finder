import React from 'react';
import SignUpForm from '../components/SignUp/Form';
import logo from '../assets/Groupfinderlogo.png';
import { Link } from 'react-router-dom';

function SignUp() {
  return (
    <>
      <nav className="flex justify-between items-center w-full bg-white py-4 px-6 shadow-md">
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Group Finder Logo" className="h-8 cursor-pointer" />
        </Link>
      </div>
      </nav>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md ">
          <h2 className="text-2xl font-bold mb-2 text-center text-blue-600">Sign up</h2>
          <p className="mb-6 text-center text-gray-700">
            Already have an account?
            <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300">
              Log in
            </a>
          </p>
          <SignUpForm />
        </div>
      </div>
    </>
  );
}

export default SignUp;
