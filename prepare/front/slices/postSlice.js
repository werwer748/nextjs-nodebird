import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  hasMorePosts: true,

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
      state.hasMorePosts = state.mainPosts.length < 50;
    },
    loadPostsFailure(state, action) {
      state.loadPostsLoading = false;
      state.loadPostsError = action.payload;
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
} = userSlice.actions;
export default userSlice;
