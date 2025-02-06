import React, { useState } from 'react';

const PasswordField = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="mb-4 relative">
      <label className="block text-gray-700">Password</label>
      <input 
        type={isPasswordVisible ? 'text' : 'password'} 
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" 
      />
      <button 
        type="button" 
        onClick={togglePasswordVisibility} 
        className="absolute right-3 top-3 text-gray-500"
      >
        <i className={`fas ${isPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i> 
        {isPasswordVisible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

export default PasswordField;
