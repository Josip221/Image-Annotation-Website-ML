import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2em;
`;

function RegisterPage() {
  let username: string, password: string, email: string;
  const onChangeUsername = (value: string) => {
    username = value;
  };

  const onChangePassword = (value: string) => {
    password = value;
  };

  const onChangeEmail = (value: string) => {
    email = value;
  };

  const onSubmit = () => {
    console.log(
      `Entered username: ${username}, password ${password}, email ${email}`
    );
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
        parentFunction={onChangeEmail}
        label={'Email'}
        type={'email'}
        placeholder={'Enter Email'}
      />
      <Input
        parentFunction={onChangePassword}
        label={'Password'}
        type={'password'}
        placeholder={'Enter Password'}
      />
      <Button parentFunction={onSubmit}>Register</Button>
      <div>
        Already got an account? <Link to="/login">Log in</Link>
      </div>
    </Wrapper>
  );
}

export default RegisterPage;
