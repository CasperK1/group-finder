import React from 'react';

const InputField = ({ type, label, placeholder, value, onChange}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" 
      />
    </div>
  );
};

export default InputField;
