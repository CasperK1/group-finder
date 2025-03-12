import '../../index.css';
import { useState, useEffect } from 'react';
import { apiService } from '../../services/api/apiService';
import { GroupHeader } from '../Group/GroupHeader';
import { GroupLocation } from '../Group/GroupLocation';
import { GroupDescription } from '../Group/GroupDescription';
import { GroupFooter } from '../Group/GroupFooter';
import { useNavigate } from 'react-router-dom';
import { convertDate } from '../../utils/date';
import { Icon } from '@iconify/react';

function GroupsList({ allGroup, ownGroup }) {
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState([]);
  const jwt = localStorage.getItem('jwtToken');
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const navigate = useNavigate();
  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
    jwt ? navigate(`/group/${groupId}`) : navigate('/login');
  };

  const handleBlockGroup = () => {
    console.log('Block');
  };
  const handleSaveGroup = () => {
    console.log('Save');
  };

  const handleCreateGroup = () => {
    jwt ? navigate('/group/create') : navigate('/login');
  };

  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true);
      try {
        let response;
        if (allGroup) {
          response = await apiService.group.getAllGroups();
        } else if (ownGroup) {
          if (!jwt) return;
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
    return <div className="text-center text-lg text-base-content">Loading...</div>;
  }

  return (
    <>
      <div className="header-section p-6 bg-base-200 rounded-xl shadow-lg mb-6" data-theme="light">
        <h2 className="text-2xl font-bold text-base-content mb-4">{`${groupData.length} Groups Found`}</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="text"
            className="input input-bordered rounded-full w-full max-w-md bg-base-100 pl-10 pr-4 py-2 placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            placeholder="🔍 Search groups..."
          />
          <select className="select select-bordered w-48 bg-base-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200">
            <option>Sort by: Newest</option>
            <option>Sort by: Popular</option>
            <option>Sort by: Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="groups-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
  {groupData.map((group) => (
    <div
      key={group._id}
      className={`bg-white w-full min-w-[250px] max-w-sm p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer relative ${
        selectedGroupId === group._id ? 'bg-blue-50 border-2 border-blue-500' : 'hover:bg-gray-50'
      }`}
      onClick={() => handleGroupSelect(group._id)}
    >
      <GroupHeader groupData={group} groupName={group.information.name} className="mb-2" />
      <GroupLocation
        year={convertDate(group.createdAt).year}
        city={group.information.city}
        time={convertDate(group.createdAt).formattedDate}
        className="text-base-content/70 mb-2"
      />
      <GroupDescription description={group.information.bio} className="text-base-content/70 mb-4" />
      <GroupFooter
        date={convertDate(group.createdAt).formattedDate}
        handleBlockGroup={handleBlockGroup}
        handleSaveGroup={handleSaveGroup}
        className="flex justify-between items-center text-sm text-base-content/60"
      />
    </div>
  ))}
</div>


      <div className="fixed bottom-6 right-6 z-[1] group">
        <button
          onClick={handleCreateGroup}
          className="btn btn-circle btn-primary hover:btn-primary/80 shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label="Create New Group"
        >
          <Icon icon="mdi:plus" width="24" height="24" />
        </button>
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-gray-800 text-white text-sm rounded py-1 px-2 whitespace-nowrap">
            Create New Group
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupsList;