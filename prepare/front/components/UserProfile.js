import { Avatar, Button, Card } from 'antd';
import { useCallback } from 'react';
import { logoutRequestAction } from '../slices/userSlice';
const { useDispatch, useSelector } = require('react-redux');

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector(state => state.user);

  console.log('me확인 ===', me);

  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  }, [dispatch]);

  return (
    <Card
      actions={[
        <div key="twit">
          짹짹
          <br />
          {me.Posts.length}
        </div>,
        <div key="followings">
          팔로잉
          <br />
          {me.Followings.length}
        </div>,
        <div key="followers">
          팔로워
          <br />
          {me.Followers.length}
        </div>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
        description={
          <Button onClick={onLogOut} loading={logOutLoading}>
            로그아웃
          </Button>
        }
      />
    </Card>
  );
};

export default UserProfile;
