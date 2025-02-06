import React from 'react';

const SocialButtons = () => {
  return (
    <div className="flex items-center justify-center mt-6 space-x-4">
      <a href="#" className="text-blue-600"><i className="fab fa-facebook-f"></i></a>
      <a href="#" className="text-gray-900"><i className="fab fa-apple"></i></a>
      <a href="#" className="text-red-600"><i className="fab fa-google"></i></a>
      <a href="#" className="text-blue-400"><i className="fab fa-twitter"></i></a>
    </div>
  );
};

export default SocialButtons;
