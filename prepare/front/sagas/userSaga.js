import axios from 'axios';
import { all, call, delay, fork, put, takeLatest } from 'redux-saga/effects';
import {
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
} from '../slices/userSlice';

function logInAPI() {
  return axios.post('/api/login');
}

function* login(action) {
  try {
    // const result = yield call(logInAPI);
    yield delay(1000);
    yield put(loginSuccessAction(action.payload));
  } catch (err) {
    yield put(loginFailureAction(err.response.data));
  }
}

function* logout() {
  try {
    // const result = yield call(logInAPI);
    yield delay(1000);
    yield put(logoutSuccessAction());
  } catch (err) {
    yield put(logoutFailureAction(err.response.data));
  }
}

function* signUp() {
  try {
    // const result = yield call(logInAPI);
    yield delay(1000);
    yield put(signupSuccessAction());
  } catch (err) {
    yield put(signupFailureAction(err.response.data));
  }
}

function* follow(action) {
  try {
    yield delay(1000);
    yield put(followSuccessAction(action.payload));
  } catch (err) {
    yield put(followFailureAction(err.response.data));
  }
}
function* unfollow(action) {
  try {
    yield delay(1000);
    yield put(unfollowSuccessAction(action.payload));
  } catch (err) {
    yield put(unfollowFailureAction(err.response.data));
  }
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
    fork(watchUnFollow), //fork()
  ]);
}
