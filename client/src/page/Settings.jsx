import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api/apiService';
import { ProfileSection } from '../components/Profile/Profile';
import { SettingSection } from '../components/Profile/Setting';

import { useUserProfile } from '../context/userProfileContext';
const SettingsPage = () => {
  // const [userProfile, setUserProfile] = useState(null);
  const jwt = localStorage.getItem('jwtToken');
  const user = JSON.parse(localStorage.getItem('user'));
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [selectedFile, setSelectedFile]=useState(null)
  const fileInputRef = useRef(null);
  const userProfile = useUserProfile();

  const handleFileChange = async(e) => {
    const file = e.target.files[0];
    console.log('File selected:', file.name);
    const formData = new FormData
      formData.append('image', file)
      try {
        const response = await apiService.file.uploadProfilePicture({ token: jwt, id: user.userId, formData});
        if (response) {
          setUserProfilePicture(response.photoUrl);
        } else {
          console.log('No data received');
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
  };

  // Handle button click to open the file input dialog
  const handleChoosePicture = () => {
    fileInputRef.current.click(); // Trigger the file input when the button is clicked
  };
  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     try {
  //       const response = await apiService.user.getUserProfile({ token: jwt});
  //       if (response) {
  //         setUserProfile(response);
  //       } else {
  //         console.log('No data received');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching group data:', error);
  //     }
  //   };
  //   fetchUserProfile();
  // }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h2 className="text-4xl font-bold text-gray-900 mb-8">Settings</h2>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProfileSection
          userProfile={userProfile}
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
