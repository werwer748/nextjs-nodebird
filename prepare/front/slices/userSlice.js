import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  isLoggedIn: false,
  me: null,
  signUpData: {},
  loginData: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginAction(state, action) {
      state.isLoggedIn = true;
      state.me = action.payload;
    },
    logoutAction(state, action) {
      state.isLoggedIn = false;
      state.me = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

export const { loginAction, logoutAction } = userSlice.actions;
export default userSlice;
