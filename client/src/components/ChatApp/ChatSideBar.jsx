import { useState, useEffect } from "react";
import { useUserProfile } from "../../context/userProfileContext";
import { apiService } from "../../services/api/apiService";
const Sidebar = ({ onGroupClick, groupIdlist }) => {
    const userProfile = useUserProfile();
    const groupsJoined = userProfile.groupsJoined
    console.log('here', groupsJoined);
  const jwt = localStorage.getItem('jwtToken');
    
    const [groups, setGroups] = useState([]);
    useEffect(() => {
      groupsJoined.map((groupId)=>{
        const fetchGroupData = async () => {
          try {
            const response = await apiService.group.getGroupInformationData({ token: jwt, groupId: groupId });
            if (response) {
              console.log('aaaa', response);
              
              setGroups((prevGroups) => {
                // Check if the group already exists by checking its groupId or name
                const isDuplicate = prevGroups.some((group) => group.id === response.id);
                if (!isDuplicate) {
                  return [...prevGroups, response];
                }
                return prevGroups; // If it's a duplicate, return the existing state
              });
            } else {
              console.log('No data received');
            }
          } catch (error) {
            console.error('Error fetching group data:', error);
          }
        };
      fetchGroupData();
      })
  
    }, []);

    console.log('dsdsdsd', groups);
    
  return (
    <div className="w-1/4 bg-white p-4 border-r border-gray-200 overflow-y-auto">
      <div className="text-lg text-blue-500 font-semibold mb-4">Conversations</div>
      <div className="space-y-4">
        {groups.map((group, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
            onClick={() => onGroupClick(group.information.name)}
          >
            <img src={group.information.image} alt={group.information.name} className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-semibold text-gray-700">{group.information.name}</div>
              <div className="text-sm text-gray-500">Supporting line text lore...</div>
            </div>
            {/* <div className="ml-auto text-sm text-gray-500">{group.time}</div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
