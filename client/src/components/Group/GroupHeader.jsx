
import React, { useEffect, useState } from 'react';
import logo from '../../assets/Groupfinderlogo.png';

export function GroupHeader({ groupInfo, groupName, user, major }) {
  const [allUsers, setAllUsers] = useState()
  useEffect(() => {
    const jwt = localStorage.getItem('jwtToken');
    const fetchAllUsers = async () => {
      try {
        const response = await apiService.user.getAllUsers({ token: jwt});
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
  }, [user]);

  console.log(allUsers);
  
  return (
    <div className="flex items-center mb-4">
      <div
        className={`${groupInfo ? 'w-50 h-50' : 'w-20 h-20'} bg-gray-300 rounded-lg flex justify-center items-center`}
      >
        <img src={logo} alt="Group logo" className="w-full h-auto rounded-full p-2" />
      </div>

      <div className={groupInfo ? 'ml-20 spacing-2' : 'ml-4 spacing-2'}>
        <h2 className="text-xl font-semibold ">{groupName}</h2>
        <p className="text-blue-500 w-full">{user || 'Default User'}</p>
        {groupInfo && <p className="text-gray-400">{major}</p>}
      </div>
    </div>
  );
}
