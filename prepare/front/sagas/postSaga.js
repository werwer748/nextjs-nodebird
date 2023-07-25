import { all, delay, fork, put, takeLatest, call, throttle } from 'redux-saga/effects';

import {
  loadPostsRequest,
  loadPostsSuccess,
  loadPostsFailure,
  loadUserPostsRequest,
  loadHashtagPostsRequest,
  loadPostRequest,
  loadPostSuccess,
  loadPostFailure,
  addPostRequest,
  addPostSuccess,
  addPostFailure,
  removePostRequest,
  removePostSuccess,
  removePostFailure,
  addCommentRequest,
  addCommentSuccess,
  addCommentFailure,
  likePostRequest,
  likePostSuccess,
  likePostFailure,
  unLikePostRequest,
  unLikePostSuccess,
  unLikePostFailure,
  uploadImagesRequest,
  uploadImagesSuccess,
  uploadImagesFailure,
  retweetRequest,
  retweetSuccess,
  retweetFailure,
  updatePostRequest,
  updatePostSuccess,
  updatePostFailure,
} from '../slices/postSlice';
import {
  addCommentAPI,
  addPostAPI,
  likePostAPI,
  loadHashtagPostsAPI,
  loadPostAPI,
  loadPostsAPI,
  loadUserPostsAPI,
  removePostAPI,
  retweetAPI,
  unLikePostAPI,
  updatePostAPI,
  uploadImagesAPI,
} from '../api/post';

function* addPost(action) {
  try {
    console.log('addPost saga action.payload === ', action.payload);
    const result = yield call(addPostAPI, action.payload);
    console.log('saga addPost', result.data);
    yield put(addPostSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(addPostFailure(err.response.data));
  }
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.payload);
    console.log('saga addComment', result.data);
    yield put(addCommentSuccess(result.data));
  } catch (err) {
    yield put(addCommentFailure(err.response.data));
  }
}

function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.payload);
    console.log('saga removePost', result.data);
    yield put(removePostSuccess(result.data));
  } catch (err) {
    yield put(removePostFailure(err.response.data));
  }
}

function* loadPosts(action) {
  try {
    // console.log('loadPosts action.payload', action.payload);
    const result = yield call(loadPostsAPI, action.payload);
    console.log('saga loadPosts', result.data);
    yield put(loadPostsSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(loadPostsFailure(err));
  }
}

function* loadUserPosts(action) {
  try {
    // console.log('loadPosts action.payload', action.payload);
    const result = yield call(loadUserPostsAPI, action.payload.userId, action.payload.lastId);
    console.log('saga loadUserPosts', result.data);
    yield put(loadPostsSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(loadPostsFailure(err));
  }
}

function* loadHashtagPosts(action) {
  try {
    // console.log('loadPosts action.payload', action.payload);
    const result = yield call(loadHashtagPostsAPI, action.payload.hashtag, action.payload.lastId);
    console.log('saga loadHashtagPosts', result.data);
    yield put(loadPostsSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(loadPostsFailure(err));
  }
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.payload);
    console.log('saga likePost', result.data);
    yield put(likePostSuccess(result.data));
  } catch (error) {
    console.error(error);
    yield put(likePostFailure(error.response.data));
  }
}

function* unLikePost(action) {
  try {
    const result = yield call(unLikePostAPI, action.payload);
    console.log('saga unLikePost', result.data);
    yield put(unLikePostSuccess(result.data));
  } catch (error) {
    console.error(error);
    yield put(unLikePostFailure(error.response.data));
  }
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.payload);
    console.log('saga uploadImages', result.data);
    yield put(uploadImagesSuccess(result.data));
  } catch (error) {
    console.error(error);
    yield put(uploadImagesFailure(error.response.data));
  }
}

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.payload);
    console.log('saga retweet', result.data);
    yield put(retweetSuccess(result.data));
  } catch (error) {
    console.error(error);
    yield put(retweetFailure(error.response.data));
  }
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.payload);
    console.log('saga loadPost', result.data);
    yield put(loadPostSuccess(result.data));
  } catch (error) {
    console.error(error);
    yield put(loadPostFailure(error.response.data));
  }
}

function* updatePost(action) {
  try {
    const result = yield call(updatePostAPI, action.payload);
    console.log('saga updatePost', result.data);
    yield put(updatePostSuccess(result.data));
  } catch (error) {
    console.error(error);
    yield put(updatePostFailure(error.response.data));
  }
}

function* watchUpdatePost() {
  yield takeLatest(updatePostRequest, updatePost);
}

function* watchLoadUserPosts() {
  yield throttle(5000, loadUserPostsRequest, loadUserPosts);
}

function* watchLoadHashtagPosts() {
  yield throttle(5000, loadHashtagPostsRequest, loadHashtagPosts);
}

function* watchLoadPost() {
  yield takeLatest(loadPostRequest, loadPost);
}

function* watchRetweet() {
  yield takeLatest(retweetRequest, retweet);
}

function* watchUploadImages() {
  yield takeLatest(uploadImagesRequest, uploadImages);
}

function* watchLikePost() {
  yield takeLatest(likePostRequest, likePost);
}

function* watchUnLikePost() {
  yield takeLatest(unLikePostRequest, unLikePost);
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
    fork(watchLoadPosts),
    fork(watchLikePost),
    fork(watchUnLikePost),
    fork(watchUploadImages),
    fork(watchRetweet),
    fork(watchLoadPost),
    fork(watchLoadUserPosts),
    fork(watchLoadHashtagPosts),
    fork(watchUpdatePost),
  ]);
}
