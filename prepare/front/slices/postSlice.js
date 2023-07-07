import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,

  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: '강준기',
      },
      content: '첫 번째 게시글 #해시태그 #익스프레스',
      Images: [
        {
          src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
        },
        {
          src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
        },
        {
          src: 'https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg',
        },
      ],
      Comments: [
        {
          id: 1,
          User: {
            nickname: 'nero',
          },
          content: '우와 개정판이 나왔군요~',
        },
        {
          id: 2,
          User: {
            nickname: 'hero',
          },
          content: '얼른 사고싶어요~',
        },
      ],
    },
  ],
  imagePaths: [],

  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

const dummyPost = {
  id: 2,
  User: {
    id: 1,
    nickname: '강준기',
  },
  content: '더미 데이터!',
  Images: [],
  Comments: [],
};

const userSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addPostRequest(state, action) {
      state.addPostLoading = true;
      state.addPostDone = false;
      state.addPostError = null;
    },
    addPostSuccess(state, action) {
      state.addPostLoading = false;
      state.addPostDone = true;
      state.mainPosts.unshift(dummyPost);
    },
    addPostFailure(state, action) {
      state.addPostLoading = false;
      state.addPostError = action.payload;
    },
    addCommentRequest(state, action) {
      console.log('reducer addComment');
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
  addPostRequest,
  addPostSuccess,
  addPostFailure,
  addCommentRequest,
  addCommentSuccess,
  addCommentFailure,
} = userSlice.actions;
export default userSlice;
