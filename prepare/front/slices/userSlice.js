import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { addPostSuccess, removePostSuccess } from './postSlice';

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

  changeNicknameLoading: false, // 닉네임 변경 시도중
  changeNicknameDone: false,
  changeNicknameError: null,

  followLoading: false, // 팔로우 시도중
  followDone: false,
  followError: null,
  unfollowLoading: false, // 언팔로우 시도중
  unfollowDone: false,
  unfollowError: null,

  me: null,
  signUpData: {},
  loginData: {},
};

const dummyUser = data => ({
  ...data,
  nickname: '휴고',
  id: 1,
  Posts: [{ id: 1 }],
  Followings: [{ nickname: '손오공' }, { nickname: '손오반' }, { nickname: '손오천' }],
  Followers: [{ nickname: '손오공' }, { nickname: '손오반' }, { nickname: '손오천' }],
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
    followRequestAction(state, action) {
      state.followLoading = true;
      state.followDone = false;
      state.followError = null;
    },
    followSuccessAction(state, action) {
      state.followLoading = false;
      state.followDone = true;
      state.me.Followings.push({ id: action.payload });
    },
    followFailureAction(state, action) {
      state.followLoading = false;
      state.followError = action.payload;
    },
    unfollowRequestAction(state, action) {
      state.unfollowLoading = true;
      state.unfollowDone = false;
      state.unfollowError = null;
    },
    unfollowSuccessAction(state, action) {
      state.unfollowLoading = false;
      state.unfollowDone = true;
      state.me.Followings = state.me.Followings.filter(v => v.id !== action.payload);
    },
    unfollowFailureAction(state, action) {
      state.unfollowLoading = false;
      state.unfollowError = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload };
    });
    builder.addCase(addPostSuccess, (state, action) => {
      state.me.Posts.unshift(action.payload);
      // return { ...state, me: { ...state.me, Posts: [action.payload, ...state.me.Posts] } };
    });
    builder.addCase(removePostSuccess, (state, action) => {
      state.me.Posts = state.me.Posts.filter(post => post.id !== action.payload);
      // return { ...state, me: { ...state.me, Posts: [action.payload, ...state.me.Posts] } };
    });
    builder.addCase(signupSuccessAction, (state, action) => {
      state.signUpError = null;
      state.signUpDone = false;
      // return { ...state, me: { ...state.me, Posts: [action.payload, ...state.me.Posts] } };
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

  followRequestAction,
  followSuccessAction,
  followFailureAction,

  unfollowRequestAction,
  unfollowSuccessAction,
  unfollowFailureAction,
} = userSlice.actions;

export default userSlice;
