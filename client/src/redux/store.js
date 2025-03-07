import { configureStore } from '@reduxjs/toolkit';
import { profilePictureSlice } from './reducer/profilePictureSlice';
import { userDataSlice } from './reducer/userDataSlice';
export const store = configureStore({
  reducer: {
    profilePicture: profilePictureSlice.reducer,
    userData: userDataSlice.reducer,
  },
});
