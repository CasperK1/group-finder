export const SettingSection = () => {
  return (
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
              <div
                className="w-12 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 
                rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-all duration-300 
                peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 
                after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-6 after:w-6 after:transition-all"
              ></div>
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
  );
};
