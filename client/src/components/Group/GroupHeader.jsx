import React from 'react';
import {Icon} from "@iconify/react";

export function GroupHeader({ userProfilePictures, groupUsers, groupInfo, groupData }) {
  const filterPhoto = (user) => userProfilePictures.filter((userPic) => userPic.userId === user);
  const groupMemberIds = groupUsers ? groupUsers.map((user) => user._id) : [];

  return (
    <div className="flex items-center mb-4">
      <div
        className={`${groupInfo ? 'w-50 h-50' : 'w-20 h-20'} bg-gray-300 rounded-lg flex justify-center items-center`}
      >
      <Icon icon="tabler:apps" width="74" height="74"  style={{color:" #000"}} />
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
            groupMemberIds.map((id, index) => (
              <div key={index} className="avatar">
                <div className="w-12">
                  <img
                    src={
                      userProfilePictures.length > 0
                        ? filterPhoto(id)[0]?.photoUrl || process.env.REACT_APP_DEFAULT_AVATAR_URL
                        : process.env.REACT_APP_DEFAULT_AVATAR_URL
                    }
                    alt={id}
                  />
                </div>
              </div>
            ))}
        </div>

        <p className="text-blue-500">{groupData.information.major}</p>
      </div>
    </div>
  );
}
