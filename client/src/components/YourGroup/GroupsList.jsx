import '../../index.css';
import { useState, useEffect } from 'react';
import { apiService } from '../../services/api/apiService';
import { GroupHeader } from '../Group/GroupHeader';
import { GroupLocation } from '../Group/GroupLocation';
import { GroupDescription } from '../Group/GroupDescription';
import { GroupFooter } from '../Group/GroupFooter';
import { useNavigate } from 'react-router-dom';
import { convertDate } from '../../utils/date';

import {} from 'react';
function GroupsList({ allGroup, ownGroup }) {
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState([]);
  const jwt = localStorage.getItem('jwtToken');
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const navigate = useNavigate();
  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
    navigate(`/group/${groupId}`);
  };

  const handleBlockGroup = () => {
    console.log('Block')
  }
  const handleSaveGroup = () => {
    console.log('Save')
  }
  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true);
      try {
        if (!jwt) return;
        let response;
        if (allGroup) {
          response = await apiService.group.getAllGroups({ token: jwt });
        } else if (ownGroup) {
          response = await apiService.user.getGroupJoined({ token: jwt });
        }
        if (!response) {
          console.log('No data received');
          return;
        }
        setGroupData(response);
      } catch (error) {
        console.error('Error fetching group data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroupData();
  }, [jwt, allGroup, ownGroup]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="header-section p-4 bg-base-200 rounded-xl shadow-md mb-4">
        <h2 className="text-lg font-semibold mb-2">{`${groupData.length} Groups Found`}</h2>
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            className="input input-bordered rounded-full w-full max-w-lg"
            placeholder="🔍 Search groups..."
          />
          <select className="select select-bordered w-36">
            <option>Sort by: Newest</option>
            <option>Sort by: Popular</option>
            <option>Sort by: Alphabetical</option>
            {/* enhance feature in future */}
          </select>
        </div>
      </div>

      <div className="groups-container">
        {groupData.map((group) => (
          <div
            key={group._id}
            className={`bg-white w-xs h-auto p-4 rounded-xl shadow-md relative z-0 ${
              selectedGroupId === group._id ? 'bg-blue-100' : ''
            }`}
            onClick={() => handleGroupSelect(group._id)}
          >
            <GroupHeader groupData={group} groupName={group.information.name} />
            <GroupLocation
              year={convertDate(group.createdAt).year}
              city={group.information.city}
              time={convertDate(group.createdAt).formattedDate}
            />
            <GroupDescription description={group.information.bio} />

            <GroupFooter date={convertDate(group.createdAt).formattedDate} handleBlockGroup={handleBlockGroup} handleSaveGroup={handleSaveGroup}/>
          </div>
        ))}
      </div>
    </>
  );
}

export default GroupsList;
