import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api/apiService';
import { ChatApp } from '../ChatApp/ChatApp';

export function GroupTabs({
  groupData,
  groupUsers,
  groupId,
  activeTab,
  setActiveTab,
  toggleChatModal,
  isChatOpen,
  isJoined,
}) {
  const [groupFiles, setGroupFiles] = useState(null);
  const [userProfilePictures, setUserProfilePictures] = useState([]);

  const jwt = localStorage.getItem('jwtToken');

  useEffect(() => {
    if (isJoined) {
      const fetchGroupFiles = async () => {
        try {
          const response = await apiService.group.getGroupFiles({ token: jwt, id: groupId });
          if (response) {
            setGroupFiles(response);
          } else {
            console.log('No data received');
          }
        } catch (error) {
          console.error('Error fetching group data:', error);
        }
      };
      fetchGroupFiles();
    }
  }, [isJoined, groupId]);
  console.log(userProfilePictures);

  useEffect(() => {
    const fetchGroupUserProfilePicture = async () => {
      try {
        const groupMemberIds = groupData.members.map((member) => member._id);
        const response = await apiService.file.getMultipleProfilePictures({ token: jwt, userIds: groupMemberIds });
        if (response) {
          setUserProfilePictures(response);
        } else {
          console.log('No data received');
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };
    fetchGroupUserProfilePicture();
  }, []);
  console.log(userProfilePictures);
  const filterPhoto = (user) => userProfilePictures.filter((userPic) => userPic.userId === user._id);

  return (
    <div className="mb-4">
      <div className="tabs flex justify-center">
        {[
          { name: 'Documents', label: 'Documents' },
          { name: 'Members', label: 'Members' },
          { name: 'Meetings', label: 'Upcoming meetings' },
        ].map((tab) => (
          <a
            key={tab.name}
            className={`tab tab-bordered px-4 py-2 ml-2 rounded-lg transition-all duration-200 ${
              activeTab === tab.name ? 'tab-active text-white bg-blue-500' : 'text-white bg-gray-500'
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.label}
          </a>
        ))}
        <button
          className="ml-4 bg-blue-500 text-white p-2 rounded-full transition transform duration-200 hover:scale-105"
          onClick={toggleChatModal}
        >
          Chat
        </button>
      </div>

      <div className="mt-4 p-4 bg-white rounded-b-lg shadow-sm">
        {activeTab === 'Documents' && <p className="text-gray-500">Here are your documents...</p>}
        {activeTab === 'Members' &&
          groupUsers.map((user, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <div className="avatar">
                <div className="w-12 rounded-full">
                  <img
                    src={
                      userProfilePictures.length > 0
                        ? filterPhoto(user)[0]?.photoUrl || process.env.REACT_APP_DEFAULT_AVATAR_URL
                        : process.env.REACT_APP_DEFAULT_AVATAR_URL
                    }
                    alt={user}
                  />
                </div>
              </div>
              <p className="text-gray-500">{user.username}</p>
            </div>
          ))}
        {activeTab === 'Meetings' && <p className="text-gray-500">Upcoming meetings schedule...</p>}
      </div>

      <div>
        {isChatOpen && (
          <ChatApp
            userProfilePictures={userProfilePictures}
            toggleChatModal={toggleChatModal}
            groupId={groupId}
            groupData={groupData}
          />
        )}
      </div>
    </div>
  );
}
