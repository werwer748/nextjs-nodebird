import { Avatar, Button, Card, List, Popover } from 'antd';
import { EllipsisOutlined, HeartOutlined, MessageOutlined, RetweetOutlined, HeartTwoTone } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import PostImages from './PostImages';
import { useCallback, useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import {
  likePostRequest,
  removePostRequest,
  retweetRequest,
  retweetStateReset,
  unLikePostRequest,
} from '../slices/postSlice';
import FollowButton from './FollowButton';
import Link from 'next/link';
import moment from 'moment';

moment.locale('ko');

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const id = useSelector(state => state.user.me?.id);
  const { removePostLoading } = useSelector(state => state.post);

  // const [liked, setLiked] = useState(false);
  const [commentFormOpened, setCommentFormOpened] = useState(false);

  const onLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    dispatch(likePostRequest(post.id));
  }, [id]);
  const onUnLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    dispatch(unLikePostRequest(post.id));
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    console.log('remove post id', post.id);
    dispatch(removePostRequest(post.id));
  }, [id]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    dispatch(retweetRequest(post.id));
  }, [id]);

  const liked = post.Likers?.find(v => v.id === id);

  return (
    <div>
      <Card
        // hoverable
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked ? (
            <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnLike} />
          ) : (
            <HeartOutlined key="heart" onClick={onLike} />
          ),
          // <HeartOutlined key="heart" />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button danger onClick={onRemovePost} loading={removePostLoading}>
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
                <Button>
                  <Link href={`/post/${post.id}`}>자세히보기</Link>
                </Button>
              </>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
        extra={id && post.User.id !== id && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet ? (
          <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
            <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`}>
                  <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />}
            />
          </Card>
        ) : (
          <>
            <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>

            <Card.Meta
              avatar={
                <Link href={`/user/${post.User.id}`}>
                  <Avatar>{post.User.nickname[0]}</Avatar>
                </Link>
              }
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />}
            />
          </>
        )}
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} setCommentFormOpened={setCommentFormOpened} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            style={{ marginTop: 30 }}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={item.User.nickname}
                  avatar={
                    <Link href={`user/${item.User.id}`}>
                      <Avatar>{item.User.nickname[0]}</Avatar>
                    </Link>
                  }
                  description={item.content}
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
