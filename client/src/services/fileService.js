import axios from 'axios';
import { apiPaths } from '../path';
export const uploadProfilePicture = async (req) => {
  const url = `${apiPaths.files}/upload/profile-picture`;
  try {
    const response = await axios.post(url, req.formData, {
      headers: {
        Authorization: `Bearer ${req.token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
  }
};

export const getProfilePicture = async (req) => {
  const userId = req.userId;
  const token = req.token;
  try {
    const url = `${apiPaths.files}/profile-picture/${userId}/`;
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
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
  const token = req.token;
  try {
    const url = `${apiPaths.files}/profile-pictures/?userIds=${userIds.join(',')}`;
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error.response ? error.response.data : error.message);
    return null;
  }
};
export const getGroupFiles = async (req) => {
  const groupId = req.id;
  const token = req.token;

  try {
    const url = `${apiPaths.files}/group/${groupId}`;
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching group files:', error.response ? error.response.data : error.message);
    return null;
  }
};

export const downloadGroupFile = async (req) => {
  const { groupId, fileId, token } = req;

  try {
    const url = `${apiPaths.files}/group/${groupId}/${fileId}`;
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading file:', error.response ? error.response.data : error.message);
    return null;
  }
};

export const uploadGroupFile = async (req) => {
  const { id, formData } = req;
  const token = req.token;

  try {
    const url = `${apiPaths.files}/upload/group/${id}`;
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading group file:', error);
    return null;
  }
};

export const deleteProfilePicture = async (req) => {
  const token = req.token;

  try {
    const url = `${apiPaths.files}/delete/profile-picture`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    return null;
  }
};

export const deleteGroupFile = async (req) => {
  const { groupId, fileId } = req;
  const token = req.token;

  try {
    const url = `${apiPaths.files}/group/${groupId}/${fileId}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting group file:', error);
    return null;
  }
};
