import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-4">
        <div className="max-w-3xl w-full p-8 bg-white shadow-2xl rounded-xl text-center transform transition duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-gray-900">About Us</h2>
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center md:space-x-4">
            <div className="w-48 h-32 bg-gray-300 flex justify-center items-center rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <span className="text-gray-500">Image</span>
            </div>
            <div className="text-left mt-4 md:mt-0">
              <h3 className="text-2xl font-semibold text-gray-800">Group Finder</h3>
              <p className="text-gray-600 text-lg">School Project</p>
              <p className="mt-3 text-gray-600 text-md leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
