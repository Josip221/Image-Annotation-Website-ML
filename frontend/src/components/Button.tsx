import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  .button {
    all: unset;
    cursor: pointer;
    background-color: ${props => props.theme.colors.button};
    padding: 0.2em;
    &:hover {
      background-color: ${props => props.theme.colors.second};
    }
  }
`;

interface ButtonProps {
  children?: React.ReactNode;
  onClick: () => void;
}

function Button({ children, onClick }: ButtonProps) {
  return (
    <Wrapper>
      <button onClick={onClick} className="button">
        {children}
      </button>
    </Wrapper>
  );
}

export default Button;
