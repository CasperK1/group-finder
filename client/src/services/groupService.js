

const apiGroupURL = 'http://localhost:3000/api/groups';

export const getGroupInformationData = async ( token, id) => {
    try {
        const response = await axios.post(`${apiGroupURL}/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
      if (!response) {
        console.error(`Error! Status: ${response.status}`);
        return;
      }
      console.log('Get group data process is successful');
      return response.data;
    } catch (error) {
      console.error('Error during Get group data process:', error.message);
      return;
    }
  };