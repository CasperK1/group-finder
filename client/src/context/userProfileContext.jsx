import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api/apiService';

const UserProfileContext = createContext();

export const useUserProfile = () => {
  return useContext(UserProfileContext);
};

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const jwt = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiService.user.getUserProfile({ token: jwt });
        if (response) {
          setUserProfile(response);
        } else {
          console.log('No data received');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, [jwt]);

  return (
    <UserProfileContext.Provider value={userProfile}>
      {children}
    </UserProfileContext.Provider>
  );
};
