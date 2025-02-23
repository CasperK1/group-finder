const ChatHeader = ({ groupName }) => (
  <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md">
    <div className="flex items-center space-x-2">
      <i className="fas fa-eye text-gray-600"></i>
      <span className="font-semibold text-gray-800">{groupName}</span>
    </div>
    <div className="flex items-center space-x-4">
      <button className="btn btn-ghost btn-sm text-gray-500">
        <i className="fas fa-bell"></i>
      </button>
      <button className="btn btn-ghost btn-sm text-gray-500">
        <i className="fas fa-cog"></i>
      </button>
    </div>
  </div>
);

export default ChatHeader