import React, { useEffect, useState, useContext } from 'react';
import { apiService } from '../../services/api/apiService';
import { useParams } from 'react-router-dom';
import { convertDate } from '../../utils/date';
import { GroupHeader } from './GroupHeader';
import { GroupLocation } from './GroupLocation';
import { GroupDescription } from './GroupDescription';
import { GroupTabs } from './GroupTabs';
import { GroupFooter } from './GroupFooter';
import { AuthContext } from '../../provider/AuthProvider';
function GroupInformation() {
  const { id } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('Documents');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const jwt = localStorage.getItem('jwtToken');
  const [userProfilePictures, setUserProfilePictures] = useState([]);

  const { user } = useContext(AuthContext);
  useEffect(() => {
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
  }, [id, isJoined]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await apiService.user.getAllUsers({ token: jwt });
        if (response) {
          setAllUsers(response);
        } else {
          console.log('No data received');
        }
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };
    fetchAllUsers();
  }, [isJoined]);

  useEffect(() => {
    const fetchGroupUserProfilePicture = async () => {
      try {
        const groupMemberIds = groupData.members.map((member) => member._id);
        const response = await apiService.file.getMultipleProfilePictures({ token: jwt, userIds: groupMemberIds });
        if (response) {
          console.log('aaaaaaaaaa', response);

          setUserProfilePictures(response);
        } else {
          console.log('No data received');
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };
    fetchGroupUserProfilePicture();
  }, [isJoined,id, isJoined]);
  console.log(userProfilePictures);

  useEffect(() => {
    if (groupData) {
      const checkUserBelongGroup = groupData.members.some((member) => member._id === user.userId);
      setIsJoined(checkUserBelongGroup);
    }
  }, [user, groupData, isJoined]);

  if (!groupData) {
    return <div>Loading...</div>;
  }

  const handleJoinGroup = async (groupId) => {
    try {
      if (isJoined) {
        return;
      }
      const response = await apiService.group.joinGroup({ token: jwt, id: groupId });
      if (!response.message) {
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

  const handleLeaveGroup = async (groupId) => {
    try {
      if (!isJoined) {
        return;
      }
      const response = await apiService.group.leaveGroup({ token: jwt, id: groupId });
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

  let groupUsers = [];

  if (allUsers && Array.isArray(allUsers)) {
    groupUsers = allUsers.filter((user) => groupData.members.some((member) => member._id === user._id));
  }

  return (
    <div className="bg-white w-full p-8 rounded-xl shadow-md relative overflow-y-auto">
      <GroupHeader
        userProfilePictures={userProfilePictures}
        groupUsers={groupUsers}
        groupInfo={true}
        groupData={groupData}
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
          groupData={groupData}
          isJoined={isJoined}
          groupUsers={groupUsers}
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
        handleLeaveGroup={() => {
          handleLeaveGroup(id);
        }}
      />
    </div>
  );
}

export default GroupInformation;
