import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api/apiService';
import logo from '../../assets/Groupfinderlogo.png';
import { useParams } from 'react-router-dom';

export function GroupHeader({ groupName, user, major }) {
  return (
    <div className="flex items-center mb-4">
      <img src={logo} alt="Group logo" className="w-20 h-autbutton " />
      <div className="ml-2 spacing-2">
        <h2 className="text-xl font-semibold mb-4">{groupName || 'Default Group Name'}</h2>
        <p className="text-blue-500">{user || 'Default User'}</p>
        <p className="text-gray-400">{major || 'Default Major'}</p>
      </div>
    </div>
  );
}

export function GroupLocation({ year = 'Unknown Year', city = 'Unknown City', time = 'Unknown Time' }) {
  return (
    <div className="mb-8 items-center justify-between">
      <p className="text-gray-400 mb-2">Location</p>
      <div className="flex justify-between text-gray-400">
        <span>{year}</span>
        <span>{city}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}

export function GroupDescription({ description = 'No description available.' }) {
  return <p className="text-gray-600 mb-4">{description}</p>;
}

function GroupTabs({ activeTab, setActiveTab, toggleChatModal, isChatOpen }) {
  const renderChatModal = () => {
    return (
      <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Chat</h2>
            <button className="text-gray-600" onClick={toggleChatModal}>
              X
            </button>
          </div>
          <div className="h-64 overflow-auto bg-gray-100 p-4 mb-4">
            <p className="text-gray-500">Chat messages will appear here...</p>
          </div>
          <div>
            <input type="text" className="w-full p-2 rounded-lg border border-gray-300" placeholder="Type a message..." />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
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
      {isChatOpen && renderChatModal()}
    </div>
  );
}

function GroupFooter({ isJoinedGroup, handleJoinGroup, handleBlockGroup, handleSaveGroup, handleLeaveGroup }) {
  const renderJoinButton = () => {
    return (
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between mb-4 px-4">
        <span className="absolute text-gray-400 z-10">28 March 2021</span>
        <div className="flex-grow flex justify-center">
          <button
            className="bg-black text-white px-4 py-2 rounded transition transform duration-200 hover:scale-105 active:scale-95"
            onClick={handleJoinGroup}
          >
            Join
          </button>
        </div>
        <div className="absolute flex space-x-4 z-10 right-0 mr-4">
          <button
            className="fas fa-ban text-black transition transform duration-200 hover:scale-110 active:scale-95"
            aria-hidden="true"
            onClick={handleBlockGroup}
          >
            icon1
          </button>
          <button
            className="fas fa-bookmark text-black transition transform duration-200 hover:scale-110 active:scale-95"
            aria-hidden="true"
            onClick={handleSaveGroup}
          >
            icon2
          </button>
        </div>
      </div>
    );
  };

  const renderLeaveButton = () => {
    return (
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between mb-4 px-4">
        <div className="flex-grow flex justify-center">
          <button
            className="bg-black text-white px-4 py-2 rounded transition transform duration-200 hover:scale-105 active:scale-95"
            onClick={handleLeaveGroup}
          >
            Leave
          </button>
        </div>
      </div>
    );
  };

  return <div>{!isJoinedGroup ? renderJoinButton() : renderLeaveButton()}</div>;
}

function GroupInformation() {
  const { id } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('Documents');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const jwt = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await apiService.getGroupInformationData({ token: jwt, id });
        if (response) {
          setGroupData(response);
        } else {
          console.log('No data received');
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

    fetchGroupData();
  }, [id]);

  if (!groupData) {
    return <div>Loading...</div>;
  }

  console.log('Group Information:', groupData[0].information.name);

  const handleJoinGroup = () => {
    console.log('Join button clicked');
    setIsJoined(true);
  };

  const handleBlockGroup = () => {
    console.log('Group is blocked');
  };
  const handleSaveGroup = () => {
    console.log('Group is saved');
  };

  const handleLeaveGroup = () => {
    console.log('Left Group');
    setIsJoined(false);
  };

  const toggleChatModal = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="bg-white w-full min-h-screen p-8 rounded-xl shadow-md relative">
      <GroupHeader groupName={groupData[0].information.name} />
      <GroupLocation
        year={new Date(groupData[0].createdAt).getFullYear()}
        city={groupData[0].information.city}
        time={new Date(groupData[0].createdAt).getDate()}
      />
      <GroupDescription description={groupData[0].information.bio} />
      {isJoined && (
        <GroupTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          toggleChatModal={toggleChatModal}
          isChatOpen={isChatOpen}
        />
      )}
      <GroupFooter
        isJoinedGroup={isJoined}
        handleJoinGroup={handleJoinGroup}
        handleBlockGroup={handleBlockGroup}
        handleSaveGroup={handleSaveGroup}
        handleLeaveGroup={handleLeaveGroup}
      />
    </div>
  );
}

export default GroupInformation;
