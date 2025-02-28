import axios from "axios";
import { apiPaths } from "../path";
export const uploadProfilePicture = async (req) => {
    const url = `${apiPaths.files}/upload/profile-picture`;
    try {
      const response = await axios.post(url, req.formData, {
        headers: {
          Authorization: `Bearer ${req.token}`,
        },
      });
      console.log(response.data); 
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
};