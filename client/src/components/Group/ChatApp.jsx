import React, { useState } from "react";

const Sidebar = () => {
  const groups = [
    { name: "Group 1", image: "https://placehold.co/40x40", time: "10 min" },
    { name: "Group 2", image: "https://placehold.co/40x40", time: "10 min" },
    { name: "Group 3", image: "https://placehold.co/40x40", time: "10 min" },
    { name: "Group 4", image: "https://placehold.co/40x40", time: "10 min" },
    { name: "Group 5", image: "https://placehold.co/40x40", time: "10 min" },
    { name: "Group 6", image: "https://placehold.co/40x40", time: "10 min" },
    { name: "Group 7", image: "https://placehold.co/40x40", time: "10 min" },
    { name: "Group 8", image: "https://placehold.co/40x40", time: "10 min" },
  ];

  return (
    <div className="w-1/4 bg-white p-4 border-r border-gray-200">
      <div className="text-lg font-semibold mb-4">Conversations</div>
      <div className="space-y-4">
        {groups.map((group, idx) => (
          <div key={idx} className="flex items-center space-x-4">
            <img
              src={group.image}
              alt={group.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-semibold">{group.name}</div>
              <div className="text-sm text-gray-500">Supporting line text lore...</div>
            </div>
            <div className="ml-auto text-sm text-gray-500">{group.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatHeader = ({ groupName }) => (
  <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
    <div className="flex items-center space-x-2">
      <i className="fas fa-eye"></i>
      <span className="font-semibold">{groupName}</span>
    </div>
    <div className="flex items-center space-x-4">
      <i className="fas fa-bell"></i>
      <i className="fas fa-cog"></i>
    </div>
  </div>
);

const ChatMessages = () => {
  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
      {/* Example messages */}
      <div className="flex justify-end">
        <div className="max-w-xs bg-gray-100 p-2 rounded-lg">
          <img
            src="https://placehold.co/100x100"
            alt="Image with shapes"
            className="w-full h-auto mb-2"
          />
          <div className="text-sm text-gray-500">Image</div>
          <div className="text-xs text-gray-400">everydumplingeever.com</div>
          <div className="mt-2 text-sm text-gray-700">Blah blah blah</div>
        </div>
      </div>
      <div className="flex">
        <div className="max-w-xs bg-gray-100 p-2 rounded-lg">
          <div className="text-sm">Yeah!!</div>
        </div>
      </div>
    </div>
  );
};

const MessageInput = () => (
  <div className="p-4 bg-white border-t border-gray-200">
    <div className="flex items-center space-x-2">
      <i className="fas fa-plus-circle text-gray-500"></i>
      <input
        type="text"
        placeholder="Type a message"
        className="flex-1 p-2 border border-gray-300 rounded-lg"
      />
      <i className="fas fa-microphone text-gray-500"></i>
    </div>
    <div className="flex space-x-2 mt-2">
      <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
        Let's do it
      </button>
      <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
        Great!
      </button>
      <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
        Great!
      </button>
    </div>
  </div>
);

export const ChatApp = ({ toggleChatModal }) => {
  const [activeGroup, setActiveGroup] = useState("Group 1");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader groupName={activeGroup} />
        <ChatMessages />
        <MessageInput />
      </div>
      <div className="flex justify-end p-4">
        <button onClick={toggleChatModal} className="btn btn-primary">
          Open Chat
        </button>
      </div>
    </div>
  );
};

// const renderChatModal = ({ toggleChatModal }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Chat</h2>
//           <button className="btn btn-ghost btn-sm" onClick={toggleChatModal}>
//             ✕
//           </button>
//         </div>
//         <div className="h-64 overflow-y-auto mb-4">
//           <div className="flex flex-col space-y-4">
//             {/* Sender Chat */}
//             <div className="self-start bg-blue-500 text-white p-3 rounded-lg max-w-xs">
//               <p>
//                 It's over Anakin, <br /> I have the high ground.
//               </p>
//             </div>

//             {/* Receiver Chat */}
//             <div className="self-end bg-gray-300 text-black p-3 rounded-lg max-w-xs">
//               <p>You underestimate my power!</p>
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <input type="text" className="input input-bordered w-full" placeholder="Type a message..." />
//           <button className="btn btn-primary">Send</button>
//         </div>
//       </div>
//     </div>
//   );
// };