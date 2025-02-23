import React, { useState } from 'react';
import { mockupChatData, groups } from '../../data/mockChatData';
import ChatSidebar from './ChatSideBar';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';

export const ChatApp = ({ toggleChatModal }) => {
  const [activeGroup, setActiveGroup] = useState('Group 1');
  const [message, setMessage] = useState('');

  const handleGroupClick = (groupName) => {
    setActiveGroup(groupName);
  };

  const renderMessages = () => {
    const { chatHistory } = mockupChatData[activeGroup] || { chatHistory: [] };
    // enhance feature later
    const userMapping = {
      '67b9c0852776e7ca17b7d38a': 'User',
      '67b9c20558ea6bde3946330e': 'Contact',
    };

    return (
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {chatHistory.length > 0 ? (
          chatHistory.map((message) => {
            const senderName = userMapping[message.sender['$oid']] || 'Unknown';
            const isUser = senderName === 'User';

            return (
              <div
                key={message._id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start space-x-3`}
              >
                <div className={`${isUser ? 'ml-auto' : ''} flex-shrink-0`}>
                  <img
                    // enhance feature later
                    src={isUser ? 'https://placehold.co/40x40?text=User' : 'https://placehold.co/40x40?text=Contact'}
                    alt={senderName}
                    className="w-10 h-10 rounded-full"
                  />
                </div>

                <div className={`max-w-xs p-3 rounded-lg ${isUser ? 'bg-purple-100' : 'bg-gray-100'}`}>
                  <div className="text-sm font-semibold text-gray-700">{message.message}</div>
                  <div className="text-xs text-gray-400">{new Date(message.timestamp).toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-2">{senderName}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-500">No messages available</div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white max-w-screen-xl w-full h-[80vh] rounded-xl shadow-lg flex overflow-hidden">
        <ChatSidebar onGroupClick={handleGroupClick} groups={groups} />
        <div className="flex-1 flex flex-col">
          <ChatHeader groupName={activeGroup} />
          <div className="flex-1 overflow-auto">{renderMessages()}</div>
          <ChatInput onSendMessage={(message) => console.log(message)} setMessage={setMessage} message={message} />
        </div>
        <div className="absolute top-4 right-4">
          <button onClick={toggleChatModal} className="btn btn-ghost btn-sm">
            Close Chat
          </button>
        </div>
      </div>
    </div>
  );
};
