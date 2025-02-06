import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center w-full bg-white p-2">
      <img src="https://placehold.co/24x24" alt="Group Finder Logo" className="mx-2"/>
      <span className="font-bold text-lg">GROUP <span className="text-blue-600">FINDER</span></span>
    </div>
  );
};

export default Logo;
