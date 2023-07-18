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

  loadMyInfoLoading: false,
  loadMyInfoDone: false,
  loadMyInfoError: null,

  loadUserInfoLoading: false,
  loadUserInfoDone: false,
  loadUserInfoError: null,

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

  loadFollowersLoading: false,
  loadFollowersDone: false,
  loadFollowersError: null,
  loadFollowingsLoading: false,
  loadFollowingsDone: false,
  loadFollowingsError: null,

  removeFollowerLoading: false,
  removeFollowerDone: false,
  removeFollowerError: null,

  me: null,
  userInfo: null,
};

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
      console.log('slice login success', action.payload);
      state.me = action.payload;
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
    loadMyInfoRequestAction(state, action) {
      state.loadMyInfoLoading = true;
      state.loadMyInfoDone = false;
      state.loadMyInfoError = null;
    },
    loadMyInfoSuccessAction(state, action) {
      state.loadMyInfoLoading = false;
      state.loadMyInfoDone = true;
      state.me = action.payload;
    },
    loadMyInfoFailureAction(state, action) {
      state.loadMyInfoLoading = false;
      state.loadMyInfoError = action.payload;
    },
    loadUserInfoRequestAction(state, action) {
      state.loadUserInfoLoading = true;
      state.loadUserInfoDone = false;
      state.loadUserInfoError = null;
    },
    loadUserInfoSuccessAction(state, action) {
      state.loadUserInfoLoading = false;
      state.loadUserInfoDone = true;
      state.userInfo = action.payload;
    },
    loadUserInfoFailureAction(state, action) {
      state.loadUserInfoLoading = false;
      state.loadUserInfoError = action.payload;
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
    signupStateResetAction(state, action) {
      state.signUpLoading = false;
      state.signUpDone = false;
      state.signUpError = null;
    },
    followRequestAction(state, action) {
      state.followLoading = true;
      state.followDone = false;
      state.followError = null;
    },
    followSuccessAction(state, action) {
      state.followLoading = false;
      state.followDone = true;
      state.me.Followings.push({ id: action.payload.UserId });
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
      state.me.Followings = state.me.Followings.filter(v => v.id !== action.payload.UserId);
    },
    unfollowFailureAction(state, action) {
      state.unfollowLoading = false;
      state.unfollowError = action.payload;
    },
    changeNicknameRequest(state, action) {
      state.changeNicknameLoading = true;
      state.changeNicknameDone = false;
      state.changeNicknameError = null;
    },
    changeNicknameSuccess(state, action) {
      state.changeNicknameLoading = false;
      state.changeNicknameDone = true;
      state.me.nickname = action.payload.nickname;
    },
    changeNicknameFailure(state, action) {
      state.changeNicknameLoading = false;
      state.changeNicknameError = action.payload;
    },
    loadFollowersRequest(state, action) {
      state.loadFollowersLoading = true;
      state.loadFollowersDone = false;
      state.loadFollowersError = null;
    },
    loadFollowersSuccess(state, action) {
      state.loadFollowersLoading = false;
      state.loadFollowersDone = true;
      state.me.Followers = action.payload;
    },
    loadFollowersFailure(state, action) {
      state.loadFollowersLoading = false;
      state.loadFollowersError = action.payload;
    },
    loadFollowingsRequest(state, action) {
      state.loadFollowingsLoading = true;
      state.loadFollowingsDone = false;
      state.loadFollowingsError = null;
    },
    loadFollowingsSuccess(state, action) {
      state.loadFollowingsLoading = false;
      state.loadFollowingsDone = true;
      state.me.Followings = action.payload;
    },
    loadFollowingsFailure(state, action) {
      state.loadFollowingsLoading = false;
      state.loadFollowingsError = action.payload;
    },
    removeFollowerRequest(state, action) {
      state.removeFollowerLoading = true;
      state.removeFollowerDone = false;
      state.removeFollowerError = null;
    },
    removeFollowerSuccess(state, action) {
      state.removeFollowerLoading = false;
      state.removeFollowerDone = true;
      state.me.Followers = state.me.Followers.filter(v => v.id !== action.payload.UserId);
    },
    removeFollowerFailure(state, action) {
      state.removeFollowerLoading = false;
      state.removeFollowerError = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload };
    });
    builder.addCase(addPostSuccess, (state, action) => {
      state.me.Posts.unshift(action.payload.id);
      // return { ...state, me: { ...state.me, Posts: [action.payload, ...state.me.Posts] } };
    });
    builder.addCase(removePostSuccess, (state, action) => {
      state.me.Posts = state.me.Posts.filter(post => post.id !== action.payload);
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

  loadMyInfoRequestAction,
  loadMyInfoSuccessAction,
  loadMyInfoFailureAction,

  loadUserInfoRequestAction,
  loadUserInfoSuccessAction,
  loadUserInfoFailureAction,

  signupRequestAction,
  signupSuccessAction,
  signupFailureAction,
  signupStateResetAction,

  followRequestAction,
  followSuccessAction,
  followFailureAction,

  unfollowRequestAction,
  unfollowSuccessAction,
  unfollowFailureAction,

  changeNicknameRequest,
  changeNicknameSuccess,
  changeNicknameFailure,

  loadFollowersRequest,
  loadFollowersSuccess,
  loadFollowersFailure,

  loadFollowingsRequest,
  loadFollowingsSuccess,
  loadFollowingsFailure,

  removeFollowerRequest,
  removeFollowerSuccess,
  removeFollowerFailure,
} = userSlice.actions;

export default userSlice;
