import axios from 'axios';

const apiGroupURL = 'http://localhost:3000/api/groups';

export const getGroupInformationData = async (token, id = null) => {
  try {
    const url = id ? `${apiGroupURL}/${id}` : apiGroupURL;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
