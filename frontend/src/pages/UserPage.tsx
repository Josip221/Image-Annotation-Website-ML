import React, { useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/auth';
import { authContextProps } from '../@interfaces/authContext';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 1em;
`;

function UserPage() {
  const { token, logOut, user } = useAuth() as authContextProps;
  useEffect(() => {
    console.log('fetch user data and sequences');
  }, []);

  return <Wrapper>User: {user.username}</Wrapper>;
}

export default UserPage;
