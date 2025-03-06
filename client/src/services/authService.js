import axios from 'axios';
import { apiPaths } from '../path';

export const handleLogin = async (payload) => {
  try {
    const response = await axios.post(`${apiPaths.auth}/login`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response) {
      console.error(`Error! Status: ${response.status}`);
      return;
    }
    return response.data;
  } catch (error) {
    console.error('Error during sign-in process:', error.message);
    return;
  }
};

export const handleRegister = async (data) => {
  try {
    const { email, password, lastName, firstName, username } = data;
    const payload = {
      email: email,
      username: username, 
      password: password,
      firstName: firstName,
      lastName: lastName,
      major: "Computer Science",
      academicInterests: ["coding"], 
      bio: "",
      timePreference: "morning",
      locationPreference: "on-campus",
      groupSizePreference: 4
    };
    const response = await axios.post(`${apiPaths.auth}/register`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response) {
      console.error(`Error! Status: ${response.status}`);
      return;
    }
    return response.data;
  } catch (error) {
    console.error('Error during register process:', error.message);
    return;
  }
};
