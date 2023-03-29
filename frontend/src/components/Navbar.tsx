import React from 'react';
import styled from 'styled-components';
import { Outlet, Link } from 'react-router-dom';

const WrapperNavBar = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;
  background-color: rgb(34, 139, 34, 0.2);
  gap: 1em;

  .link {
    font-size: 1rem;
    text-decoration: none;
  }

  .push-right {
    margin-right: auto;
  }
`;
const WrapperFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;
  background-color: rgb(34, 139, 34, 0.2);
  gap: 1em;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

function Navbar() {
  return (
    <Wrapper>
      <WrapperNavBar>
        <Link className="link" to={'/home'}>
          Home
        </Link>
        <Link className="link push-right" to="/dashboard">
          Dashboard
        </Link>
        <Link className="link" to="/dashboard">
          Sign in
        </Link>
        <Link className="link" to="/dashboard">
          Sign up
        </Link>
      </WrapperNavBar>
      <Outlet />
      <WrapperFooter>Footer</WrapperFooter>
    </Wrapper>
  );
}

export default Navbar;
