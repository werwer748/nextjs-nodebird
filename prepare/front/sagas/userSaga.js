import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import {
  loginRequestAction,
  loginSuccessAction,
  loginFailureAction,
  logoutRequestAction,
  logoutSuccessAction,
  logoutFailureAction,
  loadMyInfoRequestAction,
  loadMyInfoSuccessAction,
  loadMyInfoFailureAction,
  signupRequestAction,
  signupSuccessAction,
  signupFailureAction,
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
  loadUserInfoRequestAction,
  loadUserInfoSuccessAction,
  loadUserInfoFailureAction,
} from '../slices/userSlice';
import {
  logInAPI,
  signUpAPI,
  logOutAPI,
  loadMyInfoAPI,
  changeNicknameAPI,
  followAPI,
  unfollowAPI,
  loadFollowersAPI,
  loadFollowingsAPI,
  removeFollowerAPI,
  loadUserInfoAPI,
} from '../api/user';

function* login(action) {
  try {
    const result = yield call(logInAPI, action.payload);
    console.log('saga login result', result);
    yield put(loginSuccessAction(result.data));
  } catch (err) {
    yield put(loginFailureAction(err.response.data));
  }
}

function* logout() {
  try {
    yield call(logOutAPI);
    yield put(logoutSuccessAction());
  } catch (err) {
    yield put(logoutFailureAction(err.response.data));
  }
}

function* signUp(action) {
  try {
    // console.log('saga signUp');
    const result = yield call(signUpAPI, action.payload);
    console.log('saga signUp result', result);
    yield put(signupSuccessAction());
  } catch (err) {
    console.log('saga에서 받은 에러', err.response?.data);
    yield put(signupFailureAction(err.response?.data));
  }
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.payload);
    console.log('saga follow result.data', result.data);
    yield put(followSuccessAction(result.data));
  } catch (err) {
    yield put(followFailureAction(err.response.data));
  }
}
function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.payload);
    console.log('saga unfollow result.data', result.data);
    yield put(unfollowSuccessAction(result.data));
  } catch (err) {
    yield put(unfollowFailureAction(err.response.data));
  }
}

function* loadMyInfo() {
  try {
    const result = yield call(loadMyInfoAPI);
    console.log('saga loadMyInfo result', result);
    yield put(loadMyInfoSuccessAction(result.data));
  } catch (err) {
    yield put(loadMyInfoFailureAction(err.response.data));
  }
}

function* changeNickname(action) {
  try {
    const result = yield call(changeNicknameAPI, action.payload);
    console.log('saga changeNickname result.data', result.data);
    yield put(changeNicknameSuccess(result.data));
  } catch (error) {
    console.error(error);
    yield put(changeNicknameFailure(error.response.data));
  }
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI);
    console.log('saga loadFollowers result.data', result.data);
    yield put(loadFollowersSuccess(result.data));
  } catch (error) {
    console.error(error);
    yield put(loadFollowersFailure(error.response.data));
  }
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI);
    console.log('saga loadFollowings result.data', result.data);
    yield put(loadFollowingsSuccess(result.data));
  } catch (error) {
    console.error(error);
    yield put(loadFollowingsFailure(error.response.data));
  }
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.payload);
    console.log('saga removeFollower result.data', result.data);
    yield put(removeFollowerSuccess(result.data));
  } catch (error) {
    console.error(error);
    yield put(removeFollowerFailure(error.response.data));
  }
}

function* loadUserInfo(action) {
  try {
    const result = yield call(loadUserInfoAPI, action.payload);
    console.log('saga loadUserInfo result.data', result.data);
    yield put(loadUserInfoSuccessAction(result.data));
  } catch (error) {
    console.error(error);
    yield put(loadUserInfoFailureAction(error.response.data));
  }
}

function* watchLoadUserInfo() {
  yield takeLatest(loadUserInfoRequestAction, loadUserInfo);
}

function* watchRemoveFollower() {
  yield takeLatest(removeFollowerRequest, removeFollower);
}

function* watchLoadFollowers() {
  yield takeLatest(loadFollowersRequest, loadFollowers);
}

function* watchLoadFollowings() {
  yield takeLatest(loadFollowingsRequest, loadFollowings);
}

function* watchChangeNickname() {
  yield takeLatest(changeNicknameRequest, changeNickname);
}

function* watchLoadMyInfo() {
  yield takeLatest(loadMyInfoRequestAction, loadMyInfo);
}

function* watchFollow() {
  yield takeLatest(followRequestAction, follow);
}

function* watchUnFollow() {
  yield takeLatest(unfollowRequestAction, unfollow);
}

function* watchSignUp() {
  yield takeLatest(signupRequestAction, signUp);
}

function* watchLogin() {
  yield takeLatest(loginRequestAction, login);
}
function* watchLogout() {
  yield takeLatest(logoutRequestAction, logout);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogout),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnFollow),
    fork(watchLoadMyInfo),
    fork(watchChangeNickname),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollower),
    fork(watchLoadUserInfo),
  ]);
}
