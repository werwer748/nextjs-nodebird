import { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Input, Menu, Row, Col } from 'antd';
import styled from 'styled-components';

import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const menuItems = [
  {
    label: <Link href="/">노드버드</Link>,
    key: 'home',
  },
  {
    label: <Link href="/profile">프로필</Link>,
    key: 'profile',
  },
  {
    label: <SearchInput enterButton />,
    key: 'search',
  },
  {
    label: <Link href="/signup">회원가입</Link>,
    key: 'signup',
  },
];

const AppLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div>
      <Menu mode="horizontal" items={menuItems} />
      {/* 가로 => 세로, 모바일 => 데스크탑 */}
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {isLoggedIn ? <UserProfile setIsLoggedIn={setIsLoggedIn} /> : <LoginForm setIsLoggedIn={setIsLoggedIn} />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a href="https://github.com/werwer748" target="_blank" rel="noreferrer noopener">
            Made by HugoK
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
