'use client';

import AppLayout from '../components/AppLayout';
import { useDispatch, useSelector } from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useEffect } from 'react';
import { loadPostsRequest } from '../slices/postSlice';
import { loadMyInfoRequestAction } from '../slices/userSlice';
import wrapper from '../store/configureStore';
import { END } from 'redux-saga';
import axios from 'axios';
// import headers from 'next/headers';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector(state => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector(state => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  // useEffect(() => {
  //   dispatch(loadMyInfoRequestAction());
  // }, []);

  // useEffect(() => {
  //   if (mainPosts.length === 0) {
  //     dispatch(loadPostsRequest());
  //   }
  // }, [mainPosts]);

  useEffect(() => {
    function onScroll() {
      // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 500) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          console.log(lastId);
          dispatch(loadPostsRequest(lastId));
        }
      }
    }

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, mainPosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post, index) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res, ...etc }) => {
  // 데이터가 자주 바뀐다면 getServerSideProps를 사용하면 좋다.
  console.log('req 객체 확인 ===', req);
  const cookie = req ? req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch(loadMyInfoRequestAction());
  store.dispatch(loadPostsRequest());

  store.dispatch(END); // 공식문서에서 명시 된 사용법
  await store.sagaTask.toPromise();

  return { props: {} }; // <= 이 부분이 Home 컴포넌트의 props로 전달된다.
});

export default Home;
