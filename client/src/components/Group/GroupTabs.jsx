import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api/apiService';
import { ChatApp } from './ChatApp';
export function GroupTabs({ groupId, activeTab, setActiveTab, toggleChatModal, isChatOpen }) {
  const [groupFiles, setGroupFiles] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem('jwtToken');
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
  }, []);

  // const renderChatModal = () => {
  //   return (
  //     <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 ">
  //       <div className="bg-white p-6 rounded-lg w-96">
  //         <div className="flex justify-between mb-4">
  //           <h2 className="text-xl font-semibold">Chat</h2>
  //           <button className="text-gray-600" onClick={toggleChatModal}>
  //             X
  //           </button>
  //         </div>
  //         <div className="h-64 overflow-auto bg-gray-100 p-4 mb-4">
  //           <p className="text-gray-500">Chat messages will appear here...</p>
  //         </div>
  //         <div>
  //           <input
  //             type="text"
  //             className="w-full p-2 rounded-lg border border-gray-300"
  //             placeholder="Type a message..."
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const renderChatModal = ({ toggleChatModal }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Chat</h2>
            <button className="btn btn-ghost btn-sm" onClick={toggleChatModal}>
              ✕
            </button>
          </div>
          <div className="h-64 overflow-y-auto mb-4">
            <div className="flex flex-col space-y-4">
              {/* Sender Chat */}
              <div className="self-start bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                <p>
                  It's over Anakin, <br /> I have the high ground.
                </p>
              </div>

              {/* Receiver Chat */}
              <div className="self-end bg-gray-300 text-black p-3 rounded-lg max-w-xs">
                <p>You underestimate my power!</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <input type="text" className="input input-bordered w-full" placeholder="Type a message..." />
            <button className="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-center">
        <div className="flex items-center bg-gray-100 w-fit p-2 rounded-lg">
          {[
            { name: 'Documents', label: 'Documents' },
            { name: 'Members', label: 'Members' },
            { name: 'Meetings', label: 'Upcoming meetings' },
          ].map((tab) => (
            <button
              key={tab.name}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.name
                  ? 'border-blue-600 text-blue-600 bg-blue-500 text-white'
                  : 'border-transparent text-gray-500 bg-gray-100 hover:text-blue-600 hover:border-blue-600'
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.label}
            </button>
          ))}
          <button
            className="ml-4 bg-blue-500 text-white p-2 rounded-full transition transform duration-200 hover:scale-105"
            onClick={toggleChatModal}
          >
            Chat
          </button>
        </div>
      </div>
      <div className="mt-4 p-4 bg-white rounded-b-lg shadow-sm">
        {activeTab === 'Documents' && <p className="text-gray-500">Here are your documents...</p>}
        {activeTab === 'Members' && <p className="text-gray-500">List of group members...</p>}
        {activeTab === 'Meetings' && <p className="text-gray-500">Upcoming meetings schedule...</p>}
      </div>
      {/* {isChatOpen && renderChatModal(toggleChatModal)} */}

      <div>
      
      {isChatOpen && <ChatApp toggleChatModal={toggleChatModal} />}
    </div>
    </div>
  );
}
