import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { useDispatch, useSelector } from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useEffect } from 'react';
import { loadPostsRequest } from '../slices/postSlice';
import { loadMyInfoRequestAction } from '../slices/userSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector(state => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(state => state.post);

  useEffect(() => {
    dispatch(loadMyInfoRequestAction());
  }, []);

  useEffect(() => {
    if (mainPosts.length === 0) {
      dispatch(loadPostsRequest());
    }
  }, [mainPosts]);

  useEffect(() => {
    function onScroll() {
      // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 500) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch(loadPostsRequest());
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

export default Home;
