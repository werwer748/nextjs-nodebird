import axios from 'axios';
import { all, delay, fork, put, takeLatest, call, throttle } from 'redux-saga/effects';
import shortId from 'shortid';

import {
  loadPostsRequest,
  loadPostsSuccess,
  loadPostsFailure,
  addPostRequest,
  addPostSuccess,
  addPostFailure,
  removePostRequest,
  removePostSuccess,
  removePostFailure,
  addCommentRequest,
  addCommentSuccess,
  addCommentFailure,
  generateDummyPost,
} from '../slices/postSlice';

function addPostAPI(data) {
  return axios.post('/api/post', data);
}

function* addPost(action) {
  try {
    // const result = yield call(addPostAPI);
    const dummyPost = data => ({
      id: shortId.generate(),
      User: {
        id: 1,
        nickname: '강준기',
      },
      content: data,
      Images: [],
      Comments: [],
    });
    yield delay(1000);
    yield put(addPostSuccess(dummyPost(action.payload)));
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

function* removePost(action) {
  try {
    yield delay(1000);
    console.log('saga removePost', action.payload);
    yield put(removePostSuccess(action.payload));
  } catch (err) {
    yield put(removePostFailure(err.response.data));
  }
}

function* loadPosts() {
  try {
    yield delay(1000);
    const posts = generateDummyPost(10);
    console.log('saga loadPosts', posts);
    yield put(loadPostsSuccess(posts));
  } catch (err) {
    console.error(err);
    yield put(loadPostsFailure(err));
  }
}

function* watchLoadPosts() {
  yield throttle(5000, loadPostsRequest, loadPosts);
}

function* watchRemovePost() {
  yield takeLatest(removePostRequest, removePost);
}

function* watchAddComment() {
  yield takeLatest(addCommentRequest, addComment);
}

function* watchAddPost() {
  yield takeLatest(addPostRequest, addPost);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchRemovePost),
    fork(watchLoadPosts), //asdasdasdas
  ]);
}
