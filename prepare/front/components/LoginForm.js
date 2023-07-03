import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import useInput from '../hooks/useInput';
/*
useCallback: 함수를 캐싱하는 것.

useMemo: 값을 캐싱하는 것.

ex) styled-components 쓰기싫을때! jsx in css 쓰고싶을때!
=> const style = useMemo(() => ({ marginTop: 10 }), []);
*/

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = ({ setIsLoggedIn }) => {
  // const [id, setId] = useState('');
  // const [password, setPassword] = useState('');

  // const onChangeId = useCallback(e => {
  //   setId(e.target.value);
  // }, []);

  // const onChangePassword = useCallback(e => {
  //   setPassword(e.target.value);
  // }, []);
  const [id, onChangeId] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmitForm = useCallback(() => {
    console.log(id, password);
    setIsLoggedIn(true);
  }, [id, password, setIsLoggedIn]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input name="user-id" value={id} onChange={onChangeId} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" type="password" value={password} onChange={onChangePassword} required />
      </div>
      {/* 왠만하면 컴포넌트안에 스타일쓰지말것. 렌더링낭비됨! */}
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={false}>
          로그인
        </Button>
        <Link href="/signup">
          <Button>회원가입</Button>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

LoginForm.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default LoginForm;
