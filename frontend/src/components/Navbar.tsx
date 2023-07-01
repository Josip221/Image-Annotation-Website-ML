import styled from 'styled-components';
import { Outlet, Link } from 'react-router-dom';
import { useContext } from 'react';
import { useAuth } from '../context/auth';
import { Context } from '../context/context';
import { ContextProps } from '../@interfaces/interfaces';

const NavBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1em;
  background-color: ${props => props.theme.colors.second};
  gap: 1em;
  box-shadow: inset 0 -3em 3em rgba(0, 0, 0, 0.1), 0 0 0 2px rgb(255, 255, 255),
    0.3em 0.3em 1em rgba(0, 0, 0, 0.3);

  .link {
    font-size: 1rem;
    text-decoration: none;
    color: ${props => props.theme.colors.text};
  }

  .push-right {
    margin-right: auto;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

function Navbar() {
  const { token, logOut }: any = useAuth();
  const { sequenceData } = useContext(Context) as ContextProps;
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
              Register
            </Link>
            <Link className="link" to="/login">
              Log In
            </Link>
          </>
        )}
        {token && (
          <>
            <Link className="link push-right" to={'/home'}>
              {sequenceData.sequenceName}
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
