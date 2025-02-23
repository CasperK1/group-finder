const Sidebar = ({ onGroupClick, groups }) => {
  return (
    <div className="w-1/4 bg-white p-4 border-r border-gray-200 overflow-y-auto">
      <div className="text-lg text-blue-500 font-semibold mb-4">Conversations</div>
      <div className="space-y-4">
        {groups.map((group, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
            onClick={() => onGroupClick(group.name)}
          >
            <img src={group.image} alt={group.name} className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-semibold text-gray-700">{group.name}</div>
              <div className="text-sm text-gray-500">Supporting line text lore...</div>
            </div>
            <div className="ml-auto text-sm text-gray-500">{group.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
