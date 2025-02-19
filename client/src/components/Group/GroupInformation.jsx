import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api/apiService';
import logo from '../../assets/Groupfinderlogo.png';
import { useParams } from 'react-router-dom';
import { convertDate } from '../../utils/date';
export function GroupHeader({ groupInfo, groupName, user, major }) {
  return (
    <div className="flex items-center mb-4">
      <div
        className={`${groupInfo ? 'w-50 h-50' : 'w-20 h-20'} bg-gray-300 rounded-lg flex justify-center items-center`}
      >
        <img src={logo} alt="Group logo" className="w-auto h-auto rounded-full p-2" />
      </div>

      <div className={groupInfo ? 'ml-20 spacing-2' : 'ml-4 spacing-2'}>
        <h2 className="text-xl font-semibold ">{groupName || 'Default Group Name'}</h2>
        <p className="text-blue-500">{user || 'Default User'}</p>
        {groupInfo && <p className="text-gray-400">{major || 'Default Major'}</p>}
      </div>
    </div>
  );
}

export function GroupLocation({ groupInfo, year = 'Unknown Year', city = 'Unknown City', time = 'Unknown Time' }) {
  return (
    <div className={`${groupInfo ? 'max-w-[600px]' : ''} mb-4 items-center justify-between`}>
      <p className="text-gray-400">Location</p>
      <div className="flex justify-between text-gray-400">
        <span>{year}</span>
        <span>{city}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}

export function GroupDescription({ description = 'No description available.' }) {
  return <p className="text-gray-600 mb-8">{description}</p>;
}

function GroupTabs({ groupId, activeTab, setActiveTab, toggleChatModal, isChatOpen }) {
  const [groupFiles, setGroupFiles] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem('jwtToken');
    // const fetchGroupFiles = async () => {
    //   try {
    //     const response = await apiService.getGroupFiles({ token: jwt, id: groupId });
    //     if (response) {
    //       setGroupFiles(response);
    //     } else {
    //       console.log('No data received');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching group data:', error);
    //   }
    // };

    // fetchGroupFiles();
  }, []);

  const renderChatModal = () => {
    return (
      <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 ">
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
            <input
              type="text"
              className="w-full p-2 rounded-lg border border-gray-300"
              placeholder="Type a message..."
            />
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
      {isChatOpen && renderChatModal()}
    </div>
  );
}

export function GroupFooter({
  groupInfo,
  isJoinedGroup,
  date,
  handleJoinGroup,
  handleBlockGroup,
  handleSaveGroup,
  handleLeaveGroup,
}) {
  const Button = ({ onClick, text, className, icon }) => (
    <button
      className={`${className} transition transform duration-200 hover:scale-105 active:scale-95`}
      onClick={onClick}
    >
      {icon && <i className={icon} aria-hidden="true"></i>}
      {text}
    </button>
  );

  const renderJoinButton = () => (
    <div className="flex items-center justify-between mb-4 px-4">
      <span className="text-gray-400">{date}</span>
      {groupInfo && (
        <div className="flex-grow flex justify-center">
          <Button onClick={handleJoinGroup} text="Join" className="bg-black text-white px-4 py-2 rounded" />
        </div>
      )}

      <div className="flex space-x-4">
        <Button onClick={handleBlockGroup} className="fas fa-ban text-black" icon="fas fa-ban" />
        <Button onClick={handleSaveGroup} className="fas fa-bookmark text-black" icon="fas fa-bookmark" />
      </div>
    </div>
  );

  const renderLeaveButton = () => (
    <div className="flex items-center justify-between mb-4 px-4">
      <div className="flex-grow flex justify-center">
        <Button onClick={handleLeaveGroup} text="Leave" className="bg-black text-white px-4 py-2 rounded" />
      </div>
    </div>
  );

  return <div>{!isJoinedGroup ? renderJoinButton() : renderLeaveButton()}</div>;
}

function GroupInformation() {
  const { id } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('Documents');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  useEffect(() => {
    const jwt = localStorage.getItem('jwtToken');

    const fetchGroupData = async () => {
      try {
        const response = await apiService.getGroupInformationData({ token: jwt, id:id})
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

  const handleJoinGroup = async (groupId) => {
    try {
      const jwt = localStorage.getItem('jwtToken');
      const response = await apiService.joinGroup({ token: jwt, id:groupId });
      if (!response) {
        return;
      } else {
        setIsJoined(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlockGroup = () => {
    console.log('Group is blocked');
  };
  const handleSaveGroup = () => {
    console.log('Group is saved');
  };

  const handleLeaveGroup = async() => {
    try {
      const jwt = localStorage.getItem('jwtToken');
      const response = await apiService.leaveGroup({ token: jwt, id });
      if (!response) {
        return;
      } else {
        setIsJoined(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleChatModal = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="bg-white w-full p-8 rounded-xl shadow-md relative overflow-y-auto">
      <GroupHeader groupInfo={true} groupName={groupData[0].information.name} />
      <GroupLocation
        groupInfo={true}
        year={convertDate(groupData[0].createdAt).year}
        city={groupData[0].information.city}
        time={convertDate(groupData[0].createdAt).formattedDate}
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
        groupInfo={true}
        isJoinedGroup={isJoined}
        date={convertDate(groupData[0].createdAt).formattedDate}
        handleJoinGroup={()=>{handleJoinGroup(id)}}
        handleBlockGroup={handleBlockGroup}
        handleSaveGroup={handleSaveGroup}
        handleLeaveGroup={handleLeaveGroup}
      />
    </div>
  );
}

export default GroupInformation;
