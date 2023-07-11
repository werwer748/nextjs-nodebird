import { Button } from 'antd';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followRequestAction, unfollowRequestAction } from '../slices/userSlice';

const FollowButton = ({ post }) => {
  const dispatch = useDispatch();
  const { me, followLoading, unfollowLoading } = useSelector(state => state.user);
  const isFollowing = me?.Followings.find(v => v.id === post.User.id);

  const onClickButton = useCallback(() => {
    console.log('???', isFollowing);
    if (isFollowing) {
      dispatch(unfollowRequestAction(post.User.id));
    } else {
      dispatch(followRequestAction(post.User.id));
    }
  }, [isFollowing]);

  return (
    <Button loading={followLoading || unfollowLoading} onClick={onClickButton}>
      {isFollowing ? '언팔로우' : '팔로우'}
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.object.isRequired,
};

export default FollowButton;
