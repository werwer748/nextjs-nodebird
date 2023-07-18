import { Avatar, Button, Card } from 'antd';
import { useCallback } from 'react';
import { logoutRequestAction } from '../slices/userSlice';
import Link from 'next/link';
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
          <Link href={`/user/${me.id}`}>
            짹짹
            <br />
            {me.Posts.length}
          </Link>
        </div>,
        <div key="followings">
          <Link href={`/profile`}>
            팔로잉
            <br />
          </Link>
          {me.Followings.length}
        </div>,
        <div key="followers">
          <Link href={`/profile`}>
            팔로워
            <br />
            {me.Followers.length}
          </Link>
        </div>,
      ]}
    >
      <Card.Meta
        avatar={
          <Link href={`/user/${me.id}`}>
            <Avatar>{me.nickname[0]}</Avatar>
          </Link>
        }
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
