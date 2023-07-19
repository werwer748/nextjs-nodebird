import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { useCallback, useEffect, useState } from 'react';
import Router from 'next/router';
import { loadFollowersRequest, loadFollowingsRequest, loadMyInfoRequestAction } from '../slices/userSlice';
import wrapper from '../store/configureStore';
// import { loadPostsRequest } from '../slices/postSlice';
import { END } from 'redux-saga';
import axios from 'axios';
import useSWR from 'swr';
import { backUrl } from '../config/config';

const fetcher = url => axios.get(url, { withCredentials: true }).then(result => result.data);

const Profile = () => {
  // const dispatch = useDispatch();
  const { me } = useSelector(state => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data: followersData, error: followerError } = useSWR(
    `${backUrl}/user/followers?limit=${followersLimit}`,
    fetcher,
  );
  const { data: followingsData, error: followingError } = useSWR(
    `${backUrl}/user/followings?limit=${followingsLimit}`,
    fetcher,
  );

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit(prev => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit(prev => prev + 3);
  }, []);

  if (!me) {
    return <div>내 정보 로딩중...</div>;
  }

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList
          header="팔로잉"
          data={followingsData}
          onClickMore={loadMoreFollowings}
          loading={!followingsData && !followingError}
        />
        <FollowList
          header="팔로워"
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={!followersData && !followerError}
        />
      </AppLayout>
    </>
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
  store.dispatch(loadFollowersRequest());
  store.dispatch(loadFollowingsRequest());

  store.dispatch(END); // 공식문서에서 명시 된 사용법
  await store.sagaTask.toPromise();

  // return { props: {} };
});

export default Profile;
