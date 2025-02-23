import { handleLogin, handleRegister } from '../authService';
import { getGroupInformationData, getGroupFiles, joinGroup, leaveGroup, getAllGroups } from '../groupService';
import { getUserProfile, getAllUsers, getGroupJoined} from '../userService';

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
    getAllGroups
  },
  user: {
    getAllUsers, 
    getUserProfile,
    getGroupJoined
  }
};
