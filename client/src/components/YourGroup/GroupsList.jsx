import '../../index.css';
import { useState, useEffect } from 'react';
import { apiService } from '../../services/api/apiService';
import { GroupHeader } from '../Group/GroupHeader';
import { GroupLocation } from '../Group/GroupLocation';
import { GroupDescription } from '../Group/GroupDescription';
import { GroupFooter } from '../Group/GroupFooter';
import { useNavigate } from 'react-router-dom';
import { convertDate } from '../../utils/date';

function GroupsList() {
  const [groupData, setGroupData] = useState([]);
  const jwt = localStorage.getItem('jwtToken');
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const navigate = useNavigate();
  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId); 
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
        
        const response = await apiService.group.getAllGroups({ token: jwt });
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
          className={`bg-white w-md h-auto p-4 rounded-xl shadow-md relative ${
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
