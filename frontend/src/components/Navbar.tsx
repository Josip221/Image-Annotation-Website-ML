import React from 'react';
import styled from 'styled-components';
import { Outlet, Link } from 'react-router-dom';
import AuthContextProvider from '../context/auth';
import { useAuth } from '../context/auth';

const NavBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1em;
  background-color: ${props => props.theme.colors.second};
  gap: 1em;

  .link {
    font-size: 1rem;
    text-decoration: none;
    color: ${props => props.theme.colors.text};
  }

  .push-right {
    margin-right: auto;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;
  background-color: ${props => props.theme.colors.second};
  gap: 1em;
  margin-top: auto;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

function Navbar() {
  const { token, logOut }: any = useAuth();
  //console.log(token);
  return (
    <Wrapper>
      <NavBar>
        {!token && (
          <>
            <Link className="link push-right" to={'/home'}>
              Home
            </Link>
            <Link className="link" to="/register">
              Sign in
            </Link>
            <Link className="link" to="/login">
              Sign up
            </Link>
          </>
        )}
        {token && (
          <>
            <Link className="link push-right" to={'/home'}>
              Home
            </Link>
            <Link onClick={() => logOut()} className="link" to="/login">
              Log out
            </Link>
          </>
        )}
      </NavBar>
      <Outlet />
    </Wrapper>
  );
}

export default Navbar;
