import React from 'react';
import InputField from './InputField';
import PasswordField from './PasswordField';

function Form() {
    const handleSignIn = (e) => {
        e.preventDefault();
        console.log('Sign in');
        
    }
  return (
    <form onSubmit={handleSignIn}>
      <InputField type="text" label="Email address or user name" placeholder="Enter your email or username" />
      <PasswordField />
      <div className="flex items-center mb-4">
        <input type="checkbox" className="mr-2" />
        <label className="text-gray-700">Remember me</label>
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        Log in
      </button>
    </form>
  );
}

export default Form;
