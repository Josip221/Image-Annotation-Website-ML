import { useRouteError } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <Wrapper>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>

      <p>
        <i>
          {' '}
          {error.status} {error.statusText}
        </i>
      </p>
    </Wrapper>
  );
}
