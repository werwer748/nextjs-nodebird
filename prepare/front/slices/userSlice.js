import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  logInLoading: false,
  logInDone: false,
  logInError: null,

  logOutLoading: false,
  logOutDone: false,
  logOutError: null,

  signUpLoading: false,
  signUpDone: false,
  signUpError: null,

  me: null,
  signUpData: {},
  loginData: {},
};

const dummyUser = data => ({
  ...data,
  nickname: '휴고',
  id: 1,
  Posts: [],
  Followings: [],
  Followers: [],
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginRequestAction(state, action) {
      state.logInLoading = true;
      state.logInDone = false;
      state.logInError = null;
      state.me = null;
    },
    loginSuccessAction(state, action) {
      state.logInLoading = false;
      state.logInDone = true;
      state.me = dummyUser(action.payload);
    },
    loginFailureAction(state, action) {
      state.logInLoading = false;
      state.logInError = action.payload;
    },
    logoutRequestAction(state, action) {
      state.logOutLoading = true;
      state.logOutDone = false;
      state.logOutError = null;
    },
    logoutSuccessAction(state, action) {
      state.logOutLoading = false;
      state.logOutDone = true;
      state.me = null;
    },
    logoutFailureAction(state, action) {
      state.logOutLoading = false;
      state.logOutError = action.payload;
    },
    signupRequestAction(state, action) {
      state.signUpLoading = true;
      state.signUpDone = false;
      state.signUpError = null;
    },
    signupSuccessAction(state, action) {
      state.signUpLoading = false;
      state.signUpDone = true;
    },
    signupFailureAction(state, action) {
      state.signUpLoading = false;
      state.signUpError = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

export const {
  loginRequestAction,
  loginSuccessAction,
  loginFailureAction,

  logoutRequestAction,
  logoutSuccessAction,
  logoutFailureAction,

  signupRequestAction,
  signupSuccessAction,
  signupFailureAction,
} = userSlice.actions;

export default userSlice;
