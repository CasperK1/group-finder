import { createSlice } from '@reduxjs/toolkit';

export const userDataSlice = createSlice({
  name: 'counter',
  initialState: {
    userData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userDataSlice.actions;

export default userDataSlice.reducer;
