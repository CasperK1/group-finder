import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api/apiService';

const UserProfileContext = createContext();

export const useUserProfile = () => {
  return useContext(UserProfileContext);
};

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const jwt = localStorage.getItem('jwtToken');
  const user = JSON.parse(localStorage.getItem('user'));
  if (!jwt || !user) {
    return <div>Please log in to view your profile.</div>;
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiService.file.getProfilePicture({ token: jwt, userId: user.userId });
        if (response) {
          setUserProfile(response);
        } else {
          console.log('No data received');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Error fetching profile.');
      } finally {
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <UserProfileContext.Provider value={userProfile}>
      {children}
    </UserProfileContext.Provider>
  );
};
