import { handleLogin, handleRegister } from '../authService';
import { getGroupInformationData, getGroupFiles, joinGroup, leaveGroup} from '../groupService';

export const apiService = { handleLogin, handleRegister, getGroupInformationData, getGroupFiles, joinGroup, leaveGroup};
