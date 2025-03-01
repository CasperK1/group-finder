import { handleLogin, handleRegister } from '../authService';
import { getGroupInformationData, getGroupFiles, joinGroup, leaveGroup, getAllGroups,getGroupJoined } from '../groupService';
import { getUserProfile, getAllUsers} from '../userService';
import { uploadProfilePicture } from '../fileService';
export const apiService = {
  auth: {
    handleLogin,
    handleRegister
  },
  group: {
    getGroupInformationData,
    getGroupFiles,
    joinGroup,
    leaveGroup,
    getAllGroups,
    getGroupJoined
  },
  user: {
    getAllUsers, 
    getUserProfile,
  },
  file:{
    uploadProfilePicture
  }
};
