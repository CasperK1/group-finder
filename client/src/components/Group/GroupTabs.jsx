import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api/apiService';
import { ChatApp } from './ChatApp';
export function GroupTabs({ groupUsers, groupId, activeTab, setActiveTab, toggleChatModal, isChatOpen, isJoined }) {
  const [groupFiles, setGroupFiles] = useState(null);
  useEffect(() => {
    const jwt = localStorage.getItem('jwtToken');
    if(isJoined){
      const fetchGroupFiles = async () => {
        try {
          const response = await apiService.group.getGroupFiles({token: jwt, id: groupId });
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
            <div  key={index} className="flex items-center space-x-2 mb-2">
              <div className="avatar">
                <div className="w-12 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                  {/* updatelater */}
                </div>
              </div>
              <p className="text-gray-500">{user.username}</p>
            </div>
          ))}
        {activeTab === 'Meetings' && <p className="text-gray-500">Upcoming meetings schedule...</p>}
      </div>

      <div>{isChatOpen && <ChatApp toggleChatModal={toggleChatModal} />}</div>
    </div>
  );
}
