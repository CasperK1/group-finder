import React from 'react';

const TermsAndConditions = () => {
  return (
    <p className="text-gray-600 text-sm mb-6 mt-2 text-center">
      By continuing, you agree to our
      <a href="#" className="text-blue-600 hover:underline mx-1">
        Terms of Use
      </a>
      and
      <a href="#" className="text-blue-600 hover:underline mx-1">
        Privacy Policy
      </a>
      .
    </p>
  );
};

export default TermsAndConditions;
