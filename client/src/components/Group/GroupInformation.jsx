import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api/apiService';
import { useParams } from 'react-router-dom';
import { convertDate } from '../../utils/date';
import { GroupHeader } from './GroupHeader';
import { GroupLocation } from './GroupLocation';
import { GroupDescription } from './GroupDescription';
import { GroupTabs } from './GroupTabs';
import { GroupFooter } from './GroupFooter';

function GroupInformation() {
  const { id } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('Documents');
  const [isChatOpen, setIsChatOpen] = useState(false);
  console.log(id);

  useEffect(() => {
    const jwt = localStorage.getItem('jwtToken');

    const fetchGroupData = async () => {
      try {
        const response = await apiService.group.getGroupInformationData({ token: jwt, groupId: id });
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
  console.log(groupData);

  if (!groupData) {
    return <div>Loading...</div>;
  }

  const handleJoinGroup = async (groupId) => {
    try {
      const jwt = localStorage.getItem('jwtToken');
      const response = await apiService.group.joinGroup({ token: jwt, id: groupId });
      if (!response) {
        setIsJoined(true);
        return;
      } else {
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

  const handleLeaveGroup = async () => {
    try {
      const jwt = localStorage.getItem('jwtToken');
      const response = await apiService.group.leaveGroup({ token: jwt, id });
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
      <GroupHeader
        groupInfo={true}
        groupName={groupData.information.name}
        major={groupData.information.major}
        user={groupData.members}
      />
      <GroupLocation
        groupInfo={true}
        year={convertDate(groupData.createdAt).year}
        city={groupData.information.city}
        time={convertDate(groupData.createdAt).formattedDate}
      />
      <GroupDescription description={groupData.information.bio} />
      {isJoined && (
        <GroupTabs
          groupId={id}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          toggleChatModal={toggleChatModal}
          isChatOpen={isChatOpen}
        />
      )}
      <GroupFooter
        groupInfo={true}
        isJoinedGroup={isJoined}
        date={convertDate(groupData.createdAt).formattedDate}
        handleJoinGroup={() => {
          handleJoinGroup(id);
        }}
        handleBlockGroup={handleBlockGroup}
        handleSaveGroup={handleSaveGroup}
        handleLeaveGroup={handleLeaveGroup}
      />
    </div>
  );
}

export default GroupInformation;
