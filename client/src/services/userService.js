const apiUserURL = 'http://localhost:3000/api/users/';
import axios from "axios";
export const getAllUsers = async (token) => {
    try {
      // const url = `${apiUserURL}/profile/67b9c0852776e7ca17b7d38a`;
      const url = `${apiUserURL}`;
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
  
      console.log('Get all users process is successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error.response ? error.response.data : error.message);
      return null;
    }
  };

export const getUserProfile = async (req) => {
  try {
    const url = `${apiUserURL}/${req.id}`;
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

    console.log('Get user process is successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error.response ? error.response.data : error.message);
    return null;
  }
};
export const getGroupJoined = async (req) => {
  try {
    const url = `${apiUserURL}/groups/joined`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.token}`,
      },
    });
    console.log('process', response);

    if (response.status !== 200) {
      console.error(`Error! Status: ${response.status}`);
      return null;
    }

    console.log('Get user group process is successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error.response ? error.response.data : error.message);
    return null;
  }
};
// router.get("/groups/joined", auth, getJoinedGroups);
