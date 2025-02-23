import React from 'react';

export function GroupHeader({ groupUsers, groupInfo, groupData }) {
  return (
    <div className="flex items-center mb-4">
      <div
        className={`${groupInfo ? 'w-50 h-50' : 'w-20 h-20'} bg-gray-300 rounded-lg flex justify-center items-center`}
      >
        <img src={groupData.information.photo} alt="Group logo" className="w-full h-auto rounded-full p-2" />
      </div>

      <div className={groupInfo ? 'ml-8 space-y-2 h-50' : 'ml-4 space-y-2 h-20'}>
        <h2 className="text-xl font-semibold text-blue-500">{groupData.information.name}</h2>
        {groupInfo && (
          <p className="text-blue-500">
            {groupUsers.length > 0 ? groupUsers.map((user) => user.username).join(', ') : 'Default User'}
          </p>
        )}
        <div className="avatar-group -space-x-6 rtl:space-x-reverse">
          {groupInfo &&
            groupUsers.map((user) => (
              <div className="avatar">
                <div className="w-12">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt={user} />
                  {/* update later */}
                </div>
              </div>
            ))}
        </div>

        <p className="text-blue-500">{groupData.information.major}</p>
      </div>
    </div>
  );
}
