import axios from 'axios';

const apiGroupURL = 'http://localhost:3000/api/groups';
const apiGroupFilesURL = 'http://localhost:3000/api/files/';

export const getAllGroups = async (token) => {
  try {
    const url =  apiGroupURL;

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
    console.log('Get group data process is successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching group data:', error.response ? error.response.data : error.message);
    return null;
  }
};

export const getGroupInformationData = async ({token, groupId }) => {
  console.log(token);
  
  console.log('idhewew', groupId);
  
  try {
    const url = `${apiGroupURL}/${groupId}`

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
    console.log('Get group data process is successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching group data:', error.response ? error.response.data : error.message);
    return null;
  }
};
export const joinGroup = async (req) => {
  try {
    const url = `${apiGroupURL}/${req.id}/join`;
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
    const url = `${apiGroupURL}/${req.id}/leave`;
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

export const getGroupFiles = async ({token, id}) => {
  console.log(token,'fsdfsdfsdfdsfd');
  console.log(id);
  
  try {
    const url = `${apiGroupFilesURL}/group/${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      console.error(`Error! Status: ${response.status}`);
      return null;
    }

    console.log('Get group files process is successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching group files:', error.response ? error.response.data : error.message);
    return null;
  }
};
