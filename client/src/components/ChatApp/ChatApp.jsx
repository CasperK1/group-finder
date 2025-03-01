import React, { useState, useEffect } from "react";
import { groups } from "../../data/mockChatData";
import ChatSidebar from "./ChatSideBar";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { io } from "socket.io-client";

export const ChatApp = ({ toggleChatModal, groupId, groupData}) => {
  const [activeGroup, setActiveGroup] = useState("Group 1");
  const [messages, setMessages] = useState([]); 
  const [socket, setSocket] = useState(null);
  // const groupId = "67bf28f6b71f3dd290e57c30";
console.log(groupData);

  useEffect(() => {
    // Initialize socket connection once
    const socketInit = io("http://localhost:3000", {
      auth: { token: localStorage.getItem("jwtToken") },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });
    setSocket(socketInit)
    // Join chat group
    socketInit.emit("chat:join", { groupId });

    // Load chat history
    socketInit.on("messages:history", ({ messages }) => {
      setMessages(messages);
    });

    // Listen for new messages
    socketInit.on("message:new", ({ message }) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup: Leave room and close socket on unmount
    return () => {
      socketInit.emit("chat:leave", { groupId });
      socketInit.disconnect();
    };
  }, [groupId]);

  // Handle sending messages
  const sendMessage = (message) => {
    if (!message.trim()) return;
    console.log('mess gui', message);
    socket.emit("message:group", {
      groupId,
      text: message,
      mentions: [],
      formatting: {},
      attachments: [],
    });
    console.log('aaaaa');
    
    setMessages((prev) => [
      ...prev,
      { sender: { username: "You" }, content: { text: message }, createdAt: new Date() },
    ]);
  };

  // Handle group click
  const handleGroupClick = (groupName) => {
    setActiveGroup(groupName);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white max-w-screen-xl w-full h-[80vh] rounded-xl shadow-lg flex overflow-hidden">
        <ChatSidebar onGroupClick={handleGroupClick} />
        <div className="flex-1 flex flex-col">
          <ChatHeader groupName={activeGroup} />
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className={`p-2 rounded-lg ${msg.sender.username === "You" ? "bg-blue-200" : "bg-gray-200"}`}>
                  <strong>{msg.sender.username}:</strong> {msg.content.text}
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
