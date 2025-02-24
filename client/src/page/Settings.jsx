import React from "react";

const SettingsPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h2 className="text-4xl font-bold text-gray-900 mb-8">Settings</h2>
      
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Section */}
        <div className="bg-white p-8 shadow-2xl rounded-lg flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden mb-4 border-4 border-gray-400">
            <img src="https://via.placeholder.com/150" alt="Profile pic" className="w-full h-full object-cover" />
          </div>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            Choose Picture
          </button>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-6">Edit Profile</h3>
          <form className="w-full mt-4 space-y-4">
            <input 
              type="text" placeholder="Username" 
              className="w-full p-3 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input 
              type="email" placeholder="Email" 
              className="w-full p-3 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input 
              type="password" placeholder="Password" 
              className="w-full p-3 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <textarea 
              placeholder="Bio" 
              className="w-full p-3 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-600 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
            <button type="submit" className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition font-semibold">
              Save Changes
            </button>
          </form>
        </div>

        {/* Settings Section */}
        <div className="bg-white p-8 shadow-2xl rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h3>
          <div className="space-y-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-b border-gray-200">
                <div>
                  <h4 className="text-gray-900 font-semibold">Setting {index + 1}</h4>
                  <p className="text-gray-600 text-sm">Description of this setting.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-12 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 
                    rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-all duration-300 
                    peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 
                    after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                    after:h-6 after:w-6 after:transition-all">
                  </div>
                </label>
              </div>
            ))}
            
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-3 border-b border-gray-200">
                <label className="block text-gray-900 font-semibold">Setting {index + 5}</label>
                <select className="w-full p-3 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option>Value</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
