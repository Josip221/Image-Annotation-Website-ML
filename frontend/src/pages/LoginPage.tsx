import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

import { useAuth } from '../context/auth';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2em;
`;

function LoginPage() {
  const { user, login }: any = useAuth();
  //console.log(login);
  let username: string, password: string;
  const onChangeUsername = (value: string) => {
    username = value;
  };

  const onChangePassword = (value: string) => {
    password = value;
  };

  const onSubmit = () => {
    console.log(`Entered username: ${username}, password ${password}`);
    //empty inputs
    login('bobo2');
  };

  return (
    <Wrapper>
      <Input
        parentFunction={onChangeUsername}
        label={'Username'}
        type={'name'}
        placeholder={'Enter Username'}
      />
      <Input
        parentFunction={onChangePassword}
        label={'Password'}
        type={'password'}
        placeholder={'Enter Password'}
      />
      <Button parentFunction={onSubmit}>Log in</Button>
      <div>
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </Wrapper>
  );
}

export default LoginPage;
