import React from 'react';
import Logo from '../components/Logo';
import SignUpForm from '../components/SignUp/Form';
function SignUp() {
  return (
    <>
      <Logo />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md ">
          <div className="flex items-center justify-between mb-6"></div>

          <h2 className="text-2xl font-bold mb-2 text-center">Sign up</h2>
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
