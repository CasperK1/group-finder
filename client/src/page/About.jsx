import React from 'react';
import aboutUs from "../assets/asd.jpg"
<img src={aboutUs} alt="About page pic" className="h-8 cursor-pointer" />
const AboutPage = () => {
  return (
    <div className="flex flex-col"> 
      {/* Main Content */}
      <main className="flex flex-col items-center px-4 py-8">
        <div className="max-w-4xl w-full p-8 bg-white shadow-2xl rounded-xl text-center transform transition duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-gray-900">About Us</h2>
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center md:space-x-4">
            {/* Replace this with your own image */}
            <div className="w-64 h-40 bg-gray-300 flex justify-center items-center rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
              <img 
                src={aboutUs}
                alt="Group Finder" 
                className="object-cover w-full h-full" 
              />
            </div>
            <div className="text-left mt-4 md:mt-0">
              <h3 className="text-2xl font-semibold text-gray-800">Group Finder</h3>
              <p className="text-gray-600 text-lg">School Project</p>
              <p className="mt-3 text-gray-600 text-md leading-relaxed">
              Full-stack application made by 1st year software engineering students: Phong, Leevi, Casper and Tino for school project.
              (2nd year of studies in engineering in total)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
