import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { useEffect } from 'react';
import Router from 'next/router';
import { loadFollowersRequest, loadFollowingsRequest, loadUserInfoRequestAction } from '../slices/userSlice';
import wrapper from '../store/configureStore';
import { END } from 'redux-saga';
import { Avatar, Card } from 'antd';

const About = () => {
  const { userInfo } = useSelector(state => state.user);
  return (
    <AppLayout>
      <Head>
        <title>HugoK | NodeBird</title>
      </Head>
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
            description="노드버드 매니아"
          />
        </Card>
      ) : (
        <div>??</div>
      )}
    </AppLayout>
  );
};

// export const getStaticProps = wrapper.getStaticProps(store => async ({ req, res, ...etc }) => {
export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res, ...etc }) => {
  // 언제 접속해도 데이터가 변할일이 없다면 getStaticProps를 사용하면 좋다.
  console.log('getServerSideProps start');
  store.dispatch(loadUserInfoRequestAction(1));
  console.log('getServerSideProps end');
  store.dispatch(END);
  await store.sagaTask.toPromise();
});

export default About;
