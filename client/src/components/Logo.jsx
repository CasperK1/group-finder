import React from 'react';
import logo from '../assets/Groupfinderlogo.png';

const Logo = () => {
  return (
    <div className="flex items-center bg-white py-4 px-6 shadow-md ">
      <img src={logo} alt="Group Finder Logo" />
    </div>
  );
};

export default Logo;
