function GroupHeader({ groupName, user, major }) {
    return (
      <div className="flex items-center mb-4">
        <img src={logo} alt="Group logo" className="w-50 h-autbutton " />
        <div className="ml-20 spacing-2">
          <h2 className="text-xl font-semibold mb-4">{groupName ? groupName : 'Default Group Name'}</h2>
          <p className="text-blue-500">{user ? user : 'Default User'}</p>
          <p className="text-gray-400">{major ? major : 'Default Major'}</p>
        </div>
      </div>
    );
  }