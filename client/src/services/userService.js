const apiUserURL = 'http://localhost:3000/api/users/';

export const getAllUsers = async (req) => {
    try {
      const url = `${apiUserURL}`;
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