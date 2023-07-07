import axios from 'axios';
import { all, delay, fork, put, takeLatest } from 'redux-saga/effects';
import {
  addPostRequest,
  addPostSuccess,
  addPostFailure,
  addCommentRequest,
  addCommentSuccess,
  addCommentFailure,
} from '../slices/postSlice';

function addPostAPI(data) {
  return axios.post('/api/post', data);
}

function* addPost(action) {
  try {
    // const result = yield call(addPostAPI);
    yield delay(1000);
    yield put(addPostSuccess());
  } catch (err) {
    yield put(addPostFailure(err.response.data));
  }
}

function* addComment(action) {
  try {
    console.log('saga addComment');
    yield delay(1000);
    yield put(addCommentSuccess(action.payload));
  } catch (err) {
    yield put(addCommentFailure(err.response.data));
  }
}

function* watchAddComment() {
  yield takeLatest(addCommentRequest, addComment);
}

function* watchAddPost() {
  yield takeLatest(addPostRequest, addPost);
}

export default function* postSaga() {
  yield all([fork(watchAddPost), fork(watchAddComment)]);
}
