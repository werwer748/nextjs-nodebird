import { Avatar, Button, Card } from 'antd';
import { useCallback } from 'react';
import { logoutAction } from '../slices/userSlice';
const { useDispatch } = require('react-redux');

const UserProfile = () => {
  const dispatch = useDispatch();

  const onLogOut = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return (
    <Card
      actions={[
        <div key="twit">
          짹짹
          <br />0
        </div>,
        <div key="followings">
          팔로잉
          <br />0
        </div>,
        <div key="followers">
          팔로워
          <br />0
        </div>,
      ]}
    >
      <Card.Meta avatar={<Avatar>H</Avatar>} title="HugoK" description={<Button onClick={onLogOut}>로그아웃</Button>} />
    </Card>
  );
};

export default UserProfile;
