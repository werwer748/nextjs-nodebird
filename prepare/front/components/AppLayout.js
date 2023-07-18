import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Input, Menu, Row, Col } from 'antd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Router from 'next/router';

import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import useInput from '../hooks/useInput';

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

// const menuItems = (value, onChangeSearch, onSearch) => [
//   {
//     label: <Link href="/">노드버드</Link>,
//     key: 'home',
//   },
//   {
//     label: <Link href="/profile">프로필</Link>,
//     key: 'profile',
//   },
//   {
//     label: <SearchInput enterButton={true} />,
//     key: 'search',
//   },
//   {
//     label: <Link href="/signup">회원가입</Link>,
//     key: 'signup',
//   },
// ];

const AppLayout = ({ children }) => {
  const [searchInput, onChangeSearchInput] = useInput('');
  const { me } = useSelector(state => state.user);

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  return (
    <div>
      <Menu
        mode="horizontal"
        items={[
          {
            label: <Link href="/">노드버드</Link>,
            key: 'home',
          },
          {
            label: <Link href="/profile">프로필</Link>,
            key: 'profile',
          },
          {
            label: (
              <SearchInput enterButton={true} value={searchInput} onChange={onChangeSearchInput} onSearch={onSearch} />
            ),
            key: 'search',
          },
          // {
          //   label: <Link href="/signup">회원가입</Link>,
          //   key: 'signup',
          // },
        ]}
      />
      {/* 가로 => 세로, 모바일 => 데스크탑 */}
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
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
