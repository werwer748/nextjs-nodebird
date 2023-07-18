import { useRouter } from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import { useSelector } from 'react-redux';

import wrapper from '../../store/configureStore';

import { loadMyInfoRequestAction } from '../../slices/userSlice';
import { loadPostRequest } from '../../slices/postSlice';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import { useEffect } from 'react';
import Head from 'next/head';

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost } = useSelector(state => state.post);

  //   useEffect(() => {
  //     dispatch(loa);
  //   }, [id]);

  // if (router.isFallback) {
  //   return <div>로딩중...</div>;
  // }

  return (
    <AppLayout>
      <Head>
        <title>{singlePost?.User.nickname}님의 글</title>
        <meta name="description" content={singlePost?.content} />
        <meta property="og:title" content={`${singlePost?.User.nickname}님의 게시글`} />
        <meta property="og:description" content={singlePost?.content} />
        <meta
          property="og:image"
          content={singlePost?.Images[0] ? singlePost?.Images[0].src : 'https://nodebird.com/favicon.ico'}
        />
        <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      {singlePost ? <PostCard post={singlePost} /> : <div>게시글이 존재하지 않습니다.</div>}
    </AppLayout>
  );
};

// export async function getStaticPaths() {
//   // const result = await axios.get('/post/list'); // 요런 식으로 가져왓 paths를 생성해야함
//   return {
//     paths: [{ params: { id: '1' } }, { params: { id: '2' } }, { params: { id: '3' } }],
//     fallback: true, //true로 하면 서버사이드 렌더링이 아닌 클라이언트 사이드 렌더링으로 변경됨
//   };
// }

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res, params, ...etc }) => {
  // export const getStaticProps = wrapper.getStaticProps(store => async ({ req, res, params, ...etc }) => { // 쓰기 까다로우니까 넘어가자
  // 데이터가 자주 바뀐다면 getServerSideProps를 사용하면 좋다.
  console.log('params 확인 ===', params.id);
  const cookie = req ? req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch(loadMyInfoRequestAction());
  store.dispatch(loadPostRequest(params.id));

  store.dispatch(END); // 공식문서에서 명시 된 사용법
  await store.sagaTask.toPromise();
});

export default Post;
