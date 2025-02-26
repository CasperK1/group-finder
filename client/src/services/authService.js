import axios from 'axios';

const apiRegisterURL = 'http://localhost:3000/api/auth/register';
const apiLoginURL = 'http://localhost:3000/api/auth/login';

export const handleLogin = async (payload) => {
  try {
    const response = await axios.post(apiLoginURL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response) {
      console.error(`Error! Status: ${response.status}`);
      return;
    }
    console.log('Login process is successful');
    return response.data;
  } catch (error) {
    console.error('Error during sign-in process:', error.message);
    return;
  }
};

export const handleRegister = async (data) => {
  try {
    const { email, password, lastName, firstName } = data;
    const payload = {
      email: email,
      username: email,  // Ensure username is correctly set
      password: password,
      firstName: firstName,
      lastName: lastName,
      major: "Computer Science",
      academicInterests: ["coding"],  // Array as expected by backend
      bio: "",  // Empty string is fine
      timePreference: "morning",
      locationPreference: "on-campus",
      groupSizePreference: 4
    };
    const response = await axios.post(apiRegisterURL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response) {
      console.error(`Error! Status: ${response.status}`);
      return;
    }
    console.log('Register process is successful');
    return response.data;
  } catch (error) {
    console.error('Error during register process:', error.message);
    return;
  }
};
