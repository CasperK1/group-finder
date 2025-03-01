import axios from 'axios';
import { apiPaths } from '../path';

export const getAllGroups = async (token) => {
  try {
    const url =  apiPaths.groups;
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
      console.error(`Error! Status: ${response.status}`);
      return null;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching group data:', error.response ? error.response.data : error.message);
    return null;
  }
};

export const getGroupInformationData = async ({token, groupId }) => {
  try {
    const url = `${apiPaths.groups}/${groupId}`
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
      console.error(`Error! Status: ${response.status}`);
      return null;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching group data:', error.response ? error.response.data : error.message);
    return null;
  }
};
export const joinGroup = async (req) => {
  try {
    const url = `${apiPaths.groups}/join/${req.id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.token}`,
      },
    });

    if (response.status !== 200) {
      console.error(`Error! Status: ${response.status}`);
      return null;
    }
    console.log('Join process is successful:', response);
    return response.ok;
  } catch (error) {
    console.error('Error join group:', error.response ? error.response.data : error.message);
    return null;
  }
};

export const leaveGroup = async (req) => {
  try {
    const url = `${apiPaths.groups}/leave/${req.id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.token}`,
      },
    });
    
    if (response.status !== 200) {
      console.error(`Error! Status: ${response.status}`);
      return null;
    }
    console.log('Leave process is successful:', response);
    return response.ok;
  } catch (error) {
    console.error('Error join group:', error.response ? error.response.data : error.message);
    return null;
  }
};

export const getGroupFiles = async (req) => {
  try {
    const url = `${apiPaths.files}/group/${req.id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.token}`,
      },
    });

    if (response.status !== 200) {
      console.error(`Error! Status: ${response.status}`);
      return null;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching group files:', error.response ? error.response.data : error.message);
    return null;
  }
};

export const getGroupJoined = async ({token, groupId }) => {
  try {
    const url = `${apiPaths.groups}/auth/${groupId}`
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
      console.error(`Error! Status: ${response.status}`);
      return null;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching group data:', error.response ? error.response.data : error.message);
    return null;
  }
};
