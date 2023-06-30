import { Avatar, Button, Card } from 'antd';
import { useCallback } from 'react';
import PropTypes from 'prop-types';

const UserProfile = ({ setIsLoggedIn }) => {
  const onLogOut = useCallback(() => {
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

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

UserProfile.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default UserProfile;
