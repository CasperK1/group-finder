import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api/apiService';
import { ProfileSection } from '../components/Profile/Profile';
import { SettingSection } from '../components/Profile/Setting';
import { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setProfilePicture } from '../redux/reducer/profilePictureSlice';

const SettingsPage = () => {
  const jwt = localStorage.getItem('jwtToken');
  const fileInputRef = useRef(null);
  const { user } = useContext(AuthContext);
  const { profilePicture } = useSelector((state) => state.profilePicture);
  const dispatch = useDispatch();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await apiService.file.uploadProfilePicture({ token: jwt, id: user.userId, formData });
      if (response) {
        console.log(response);
        dispatch(setProfilePicture(response.photoUrl));
      } else {
        console.log('No data received');
      }
    } catch (error) {
      console.error('Error fetching group data:', error);
    }
  };

  const handleChoosePicture = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    console.log(profilePicture);
  }, [profilePicture]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h2 className="text-4xl font-bold text-gray-900 mb-8">Settings</h2>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProfileSection
          profilePicture={profilePicture}
          handleChoosePicture={handleChoosePicture}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />
        <SettingSection />
      </div>
    </div>
  );
};

export default SettingsPage;
