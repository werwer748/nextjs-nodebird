import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import shortId from 'shortid';
import { faker } from '@faker-js/faker';

export const generateDummyPost = number =>
  Array(number)
    .fill()
    .map((v, i) => ({
      id: shortId.generate(),
      User: {
        id: shortId.generate(),
        nickname: faker.internet.userName(),
      },
      content: faker.lorem.paragraph(),
      Images: [
        {
          src: faker.image.urlLoremFlickr(),
        },
      ],
      Comments: [
        {
          User: {
            id: shortId.generate(),
            nickname: faker.internet.userName(),
          },
          content: faker.lorem.sentence(),
        },
      ],
    }));

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
  // mainPosts: [
  //   {
  //     id: 1,
  //     User: {
  //       id: 1,
  //       nickname: '강준기',
  //     },
  //     content: '첫 번째 게시글 #해시태그 #익스프레스',
  //     Images: [
  //       {
  //         id: shortId.generate(),
  //         src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
  //       },
  //       {
  //         id: shortId.generate(),
  //         src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
  //       },
  //       {
  //         id: shortId.generate(),
  //         src: 'https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg',
  //       },
  //     ],
  //     Comments: [
  //       {
  //         id: shortId.generate(),
  //         User: {
  //           id: shortId.generate(),
  //           nickname: 'nero',
  //         },
  //         content: '우와 개정판이 나왔군요~',
  //       },
  //       {
  //         id: shortId.generate(),
  //         User: {
  //           id: shortId.generate(),
  //           nickname: 'hero',
  //         },
  //         content: '얼른 사고싶어요~',
  //       },
  //     ],
  //   },
  //   ...dummyPosts,
  // ],
  imagePaths: [],

  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
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
      state.mainPosts = state.mainPosts.filter(v => v.id !== action.payload);
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
      const post = state.mainPosts.find(v => v.id === action.payload.postId);
      post.Comments.unshift(action.payload);
    },
    addCommentFailure(state, action) {
      state.addCommentLoading = false;
      state.addCommentError = action.payload;
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
} = userSlice.actions;
export default userSlice;
