import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api/apiService';

const UserProfileContext = createContext();

export const useUserProfile = () => {
  return useContext(UserProfileContext);
};

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const jwt = localStorage.getItem('jwtToken');
  const user = JSON.parse(localStorage.getItem('user'));

  const refreshUserProfile = useCallback(async () => {
    if (!jwt || !user?.userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.file.getProfilePicture({
        token: jwt,
        userId: user.userId,
      });

      if (response) {
        setUserProfile(response);
        setError(null);
      } else {
        setUserProfile(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [jwt, user?.userId]);

  // Initial profile fetch
  useEffect(() => {
    refreshUserProfile();
  }, [refreshUserProfile]);

  // Check for expiration and refresh if needed
  useEffect(() => {
    if (!userProfile?.expiresAt) return;

    const expirationTime = new Date(userProfile.expiresAt).getTime();
    const currentTime = Date.now();

    // If expiration is within the next hour, set up a refresh timer
    if (expirationTime - currentTime < 3600000) {
      // Schedule refresh 5 minutes before expiration
      const refreshTime = Math.max(expirationTime - currentTime - 300000, 0);
      const timerId = setTimeout(refreshUserProfile, refreshTime);

      return () => clearTimeout(timerId);
    }
  }, [userProfile, refreshUserProfile]);

  // Value to provide through context
  const contextValue = {
    profile: userProfile,
    loading,
    error,
    refreshProfile: refreshUserProfile,
  };

  return <UserProfileContext.Provider value={contextValue}>{children}</UserProfileContext.Provider>;
};
