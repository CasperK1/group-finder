import '../../index.css';
import { useState, useEffect } from 'react';
import { apiService } from '../../services/api/apiService';
import { GroupHeader, GroupLocation, GroupDescription, GroupFooter } from '../Group/GroupInformation';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { convertDate } from '../../utils/date';
const groupsData = [
  { id: 1, name: 'Group 1', category: 'Software Engineering', icon: '📘' },
  { id: 2, name: 'Group 2', category: 'Software Engineering', icon: '📘' },
  { id: 3, name: 'Group 3', category: 'Health Tech', icon: '🔤' },
  { id: 4, name: 'Group 4', category: 'Software Engineering', icon: '🎯' },
  { id: 5, name: 'Group 5', category: 'Software Engineering', icon: '🌐' },
  { id: 6, name: 'Group 6', category: 'Software Engineering', icon: '🏠' },
  { id: 7, name: 'Group 7', category: 'Health Tech', icon: '📒' },
  { id: 8, name: 'Group 8', category: 'Health Tech', icon: '➕' },
  { id: 9, name: 'Group 9', category: 'Software Engineering', icon: '📘' },
];

function GroupsList() {
  const [groupData, setGroupData] = useState([]);
  const jwt = localStorage.getItem('jwtToken');
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function
  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId); // Set the selected group ID
    console.log(groupId);
    navigate(`/group/${groupId}`)
  };

  useEffect(() => {
    console.log('Fetching group data...');
    const fetchGroupData = async () => {
      try {
        const jwt = localStorage.getItem('jwtToken');
        console.log('Token:', jwt);
        if (!jwt) return;
        
        const response = await apiService.getGroupInformationData({ token: jwt });
        if (!response) {
          console.log('No data received');
          return;
        }
        
        setGroupData(response);
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };
  
    fetchGroupData();
  }, [])

  return (
    <div className="groups-container">
      {groupData.map((group) => (
        <div
          key={group._id}
          className={`bg-white w-xs h-auto p-4 rounded-xl shadow-md relative ${
            selectedGroupId === group._id ? 'bg-blue-100' : ''
          }`}
          onClick={() => handleGroupSelect(group._id)}
        >
          <GroupHeader groupName={group.information.name} />
          <GroupLocation
            year={convertDate(group.createdAt).year}
            city={group.information.city}
            time={convertDate(group.createdAt).formattedDate}
          />
          <GroupDescription description={group.information.bio} />
        
        <GroupFooter date= {convertDate(groupData[0].createdAt).formattedDate}
      />
        </div>
      ))}
    </div>
  );
}

export default GroupsList;
