import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ChatSidebar from './ChatSideBar';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import { apiService } from '../../services/api/apiService';
export const ChatApp = ({ toggleChatModal, groupId, groupData }) => {
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [newText, setNewText] = useState('');
  const [userProfilePictures, setUserProfilePictures] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const jwt = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchGroupUserProfilePicture = async () => {
      try {
        const response = await apiService.file.getMultipleProfilePictures({ token: jwt, userIds: groupData.members });
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

  useEffect(() => {
    const socketInit = io(process.env.REACT_APP_GROUP_FINDER, {
      auth: { token: jwt },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });
    setSocket(socketInit);

    // Emit chat:join event
    socketInit.emit('chat:join', { groupId });

    // Load chat history
    socketInit.on('messages:history', ({ messages }) => {
      setMessages(messages);
    });

    // Listen for new messages
    socketInit.on('message:new', ({ message }) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInit.on('message:edited', ({ messageId, text, formatting, editedAt }) => {
      setMessages((prevMessages) => {
        return prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, content: { ...msg.content, text, formatting }, editedAt } : msg,
        );
      });
    });

    socketInit.on('message:edited', ({ messageId, deletedAt }) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
    });

    // Listen for bot messages (e.g., user joined the room)
    socketInit.on('message:bot', ({ message }) => {
      setMessages((prev) => [...prev, { text: message, isBot: true }]);
    });

    // Cleanup on unmount
    return () => {
      socketInit.emit('chat:leave', { groupId });
      socketInit.disconnect();
    };
  }, [groupId, editingMessage]);

  // Handle sending messages
  const sendMessage = (message) => {
    if (!message.trim()) return;
    socket.emit('message:group', {
      groupId,
      text: message,
      mentions: [],
      formatting: {},
      attachments: [],
    });
    setMessages((prev) => [
      ...prev,
      { sender: { username: user.username }, content: { text: message }, createdAt: new Date() },
    ]);
  };

  const startEditingMessage = (message) => {
    setEditingMessage(message);
    setNewText(message.content.text);
  };

  const saveEditedMessage = (message) => {
    const messageId = message._id;
    if (newText.trim() === '') return;
    socket.emit('message:edit', {
      messageId,
      text: newText,
      formatting: message.content.formatting,
    });
    setEditingMessage(null);
    setNewText('');
  };

  const deleteMessage = (message) => {
    const messageId = message._id;
    if (newText.trim() === '') return;
    socket.emit('message:delete', {
      messageId,
    });
    setEditingMessage(null);
    setNewText('');
  };

  const cancelEditingMessage = () => {
    setEditingMessage(null);
    setNewText('');
  };

  const currentUser = (msg) => msg.sender?.username === user.username;

  const editButtonLabels = [
    { label: 'Save', actionType: 'save' },
    { label: 'Delete', actionType: 'delete' },
    { label: 'Cancel', actionType: 'cancel' },
  ];

  const handleButtonClick = (actionType, msg) => {
    switch (actionType) {
      case 'save':
        saveEditedMessage(msg);
        break;
      case 'cancel':
        cancelEditingMessage();
        break;
      case 'delete':
        deleteMessage(msg);
        break;
      default:
        console.error('Unknown action type');
        break;
    }
  };
  const senderProfile = (msg) => {
    const profile = userProfilePictures.find((profile) => profile.userId === msg.sender.userId);
    return profile ? profile.photoUrl : process.env.REACT_APP_DEFAULT_AVATAR_URL;
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white max-w-screen-xl w-full h-[80vh] rounded-xl shadow-lg flex overflow-hidden">
        <ChatSidebar setActiveGroup={setActiveGroup} />
        <div className="flex-1 flex flex-col">
          <ChatHeader groupName={activeGroup} />
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index}>
                  <div className="flex">
                    <div className="w-full">
                      {currentUser(msg) && (
                        <button
                          onClick={() => startEditingMessage(msg)}
                          className="text-blue-500 text-sm flex justify-end w-full"
                        >
                          Edit
                        </button>
                      )}
                      <div className={`flex ${!currentUser(msg) ? 'justify-start' : 'justify-end'} items-center mt-1`}>
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                          <img
                            src={senderProfile(msg)}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className={`${currentUser(msg) ? 'justify-end' : ''} bg-gray-200 rounded-2xl py-2 px-4`}>
                          {editingMessage && editingMessage._id === msg._id ? (
                            <div>
                              <textarea
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                                rows={3}
                                className="w-full p-4 rounded-lg shadow-md focus:ring-2 focus:ring-red-500 resize-none text-sm bg-base-200  border-none"
                              />
                              <div className="flex justify-end space-x-2 mt-2">
                                {editButtonLabels.map((button, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleButtonClick(button.actionType, msg)}
                                    className="text-blue-500 hover:text-blue-600 text-xs font-semibold"
                                  >
                                    {button.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div>{msg.content.text}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No messages available</div>
            )}
          </div>
          <ChatInput onSendMessage={sendMessage} />
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
