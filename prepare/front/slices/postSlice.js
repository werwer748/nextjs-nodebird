import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  hasMorePosts: true,

  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,
  singlePost: null,

  addPostLoading: false,
  addPostDone: false,
  addPostError: null,

  removePostLoading: false,
  removePostDone: false,
  removePostError: null,

  mainPosts: [],
  imagePaths: [],

  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,

  likePostLoading: false,
  likePostDone: false,
  likePostError: null,

  unLikePostLoading: false,
  unLikePostDone: false,
  unLikePostError: null,

  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,

  retweetLoading: false,
  retweetDone: false,
  retweetError: null,
};

const userSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    loadPostsRequest(state, action) {
      state.loadPostsLoading = true;
      state.loadPostsDone = false;
      state.loadPostsError = null;
    },
    loadPostsSuccess(state, action) {
      state.loadPostsLoading = false;
      state.loadPostsDone = true;
      // const data = action.payload;
      state.mainPosts = state.mainPosts.concat(action.payload);
      state.hasMorePosts = action.payload.length === 10;
    },
    loadPostsFailure(state, action) {
      state.loadPostsLoading = false;
      state.loadPostsError = action.payload;
    },
    loadUserPostsRequest(state, action) {
      state.loadPostsLoading = true;
      state.loadPostsDone = false;
      state.loadPostsError = null;
    },
    loadHashtagPostsRequest(state, action) {
      state.loadPostsLoading = true;
      state.loadPostsDone = false;
      state.loadPostsError = null;
    },
    loadPostRequest(state, action) {
      state.loadPostLoading = true;
      state.loadPostDone = false;
      state.loadPostError = null;
    },
    loadPostSuccess(state, action) {
      state.loadPostLoading = false;
      state.loadPostDone = true;
      state.singlePost = action.payload;
    },
    loadPostFailure(state, action) {
      state.loadPostLoading = false;
      state.loadPostError = action.payload;
    },
    addPostRequest(state, action) {
      state.addPostLoading = true;
      state.addPostDone = false;
      state.addPostError = null;
    },
    addPostSuccess(state, action) {
      state.addPostLoading = false;
      state.addPostDone = true;
      state.mainPosts.unshift(action.payload);
      state.imagePaths = [];
    },
    addPostFailure(state, action) {
      state.addPostLoading = false;
      state.addPostError = action.payload;
    },
    removePostRequest(state, action) {
      state.removePostLoading = true;
      state.removePostDone = false;
      state.removePostError = null;
    },
    removePostSuccess(state, action) {
      state.removePostLoading = false;
      state.removePostDone = true;
      state.mainPosts = state.mainPosts.filter(v => v.id !== action.payload.PostId);
    },
    removePostFailure(state, action) {
      state.removePostLoading = false;
      state.removePostError = action.payload;
    },
    addCommentRequest(state, action) {
      state.addCommentLoading = true;
      state.addCommentDone = false;
      state.addCommentError = null;
    },
    addCommentSuccess(state, action) {
      state.addCommentLoading = false;
      state.addCommentDone = true;
      const post = state.mainPosts.find(v => v.id === action.payload.PostId);
      post.Comments.unshift(action.payload);
    },
    addCommentFailure(state, action) {
      state.addCommentLoading = false;
      state.addCommentError = action.payload;
    },
    likePostRequest(state, action) {
      state.likePostLoading = true;
      state.likePostDone = false;
      state.likePostError = null;
    },
    likePostSuccess(state, action) {
      state.likePostLoading = false;
      state.likePostDone = true;
      const post = state.mainPosts.find(v => v.id === action.payload.PostId);
      post.Likers.push({ id: action.payload.UserId });
    },
    likePostFailure(state, action) {
      state.likePostLoading = false;
      state.likePostError = action.payload;
    },
    unLikePostRequest(state, action) {
      state.unLikePostLoading = true;
      state.unLikePostDone = false;
      state.unLikePostError = null;
    },
    unLikePostSuccess(state, action) {
      state.unLikePostLoading = false;
      state.unLikePostDone = true;
      const post = state.mainPosts.find(v => v.id === action.payload.PostId);
      post.Likers = post.Likers.filter(v => v.id !== action.payload.UserId);
    },
    unLikePostFailure(state, action) {
      state.unLikePostLoading = false;
      state.unLikePostError = action.payload;
    },
    uploadImagesRequest(state, action) {
      state.uploadImagesLoading = true;
      state.uploadImagesDone = false;
      state.uploadImagesError = null;
    },
    uploadImagesSuccess(state, action) {
      state.uploadImagesLoading = false;
      state.uploadImagesDone = true;
      state.imagePaths = action.payload;
    },
    uploadImagesFailure(state, action) {
      state.uploadImagesLoading = false;
      state.uploadImagesError = action.payload;
    },
    removeImage(state, action) {
      state.imagePaths = state.imagePaths.filter((v, i) => i !== action.payload);
    },
    retweetRequest(state, action) {
      state.retweetLoading = true;
      state.retweetDone = false;
      state.retweetError = null;
    },
    retweetSuccess(state, action) {
      state.retweetLoading = false;
      state.retweetDone = true;
      state.mainPosts.unshift(action.payload);
    },
    retweetFailure(state, action) {
      state.retweetLoading = false;
      state.retweetError = action.payload;
    },
    retweetStateReset(state, action) {
      state.retweetLoading = false;
      state.retweetDone = false;
      state.retweetError = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

export const {
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

  removeImage,

  retweetRequest,
  retweetSuccess,
  retweetFailure,
  retweetStateReset,
} = userSlice.actions;
export default userSlice;
