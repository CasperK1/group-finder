export const SettingSection = () => {
  return (
    <div className="bg-base-100 p-8 shadow-2xl rounded-lg">
      <h3 className="text-2xl font-semibold text-base-content mb-6">Settings</h3>
      <div className="space-y-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center justify-between p-3 border-b border-base-200">
            <div>
              <h4 className="text-base-content font-semibold">Setting {index + 1}</h4>
              <p className="text-base-content/60 text-sm">Description of this setting.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div
                className="w-12 h-7 bg-base-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary
                rounded-full peer dark:bg-base-300 peer-checked:bg-primary transition-all duration-300
                peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5
                after:left-[4px] after:bg-base-100 after:border-base-300 after:border after:rounded-full
                after:h-6 after:w-6 after:transition-all"
              ></div>
            </label>
          </div>
        ))}

        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-3 border-b border-base-200">
            <label className="block text-base-content font-semibold">Setting {index + 5}</label>
            <select className="w-full p-3 border border-base-300 rounded-lg text-base-content placeholder-base-content/60 focus:ring-2 focus:ring-primary focus:outline-none bg-base-100">
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