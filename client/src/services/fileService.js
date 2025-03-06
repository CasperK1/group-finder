import axios from "axios";
import { apiPaths } from "../path";
export const uploadProfilePicture = async (req) => {
    const url = `${apiPaths.files}/upload/profile-picture`;
    try {
      const response = await axios.post(url, req.formData, {
        headers: {
          Authorization: `Bearer ${req.token}`,
        },
      });
      return response.data
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
};

export const getProfilePicture = async (req) => {
  const userId = req.userId;
  const token  = req.token;
  try {
    const url = `${apiPaths.files}/profile-picture/${userId}/`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error.response ? error.response.data : error.message);
    return null;
  }
};


export const getMultipleProfilePictures = async (req) => {
  const userIds = req.userIds;
  const token  = req.token;
  try {
    const url = `${apiPaths.files}/profile-pictures/?userIds=${userIds.join(',')}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error.response ? error.response.data : error.message);
    return null;
  }
};