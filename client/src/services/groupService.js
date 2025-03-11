import axios from 'axios';
import { apiPaths } from '../path';

export const getAllGroups = async () => {
  try {
    const url = apiPaths.groups;
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
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

export const getGroupInformationData = async ({ token, groupId }) => {
  try {
    const url = `${apiPaths.groups}/${groupId}`;
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
    console.log(req.id);
    console.log(url);

    const response = await axios.put(
      url,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${req.token}`,
        },
      },
    );

    if (response.status !== 200) {
      console.error(`Error! Status: ${response.status}`);
      return null;
    }
    console.log('Join process is successful:', response);
    return response.data;
  } catch (error) {
    console.error('Error joining group:', error.response ? error.response.data : error.message);
    return null;
  }
};

export const leaveGroup = async (req) => {
  try {
    const url = `${apiPaths.groups}/leave/${req.id}`;
    const response = await axios.put(
      url,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${req.token}`,
        },
      },
    );

    if (response.status !== 200) {
      console.error(`Error! Status: ${response.status}`);
      return null;
    }
    console.log('Leave process is successful:', response);
    return response.data;
  } catch (error) {
    console.error('Error leaving group:', error.response ? error.response.data : error.message);
    return null;
  }
};

export const getGroupFiles = async (req) => {
  try {
    const url = `${apiPaths.files}/group/${req.id}`;
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
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

export const createGroup= async (groupData, { token }) => {
  try {
    const url = `${apiPaths.groups}/`;
    const response = await axios.post(
      url,
      groupData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 201) { // 201 for Created
      console.error(`Error! Status: ${response.status}`);
      return null;
    }

    console.log('Group creation successful:', response.data);
    return response.data; // Should return the created group object
  } catch (error) {
    console.error('Error creating group:', error.response ? error.response.data : error.message);
    return null;
  }
}