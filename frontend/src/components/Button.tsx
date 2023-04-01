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
  children: string;
  parentFunction?: () => void;
}

function Button({ children, parentFunction }: ButtonProps) {
  const handleClick = () => {
    parentFunction?.();
  };

  //fix enter key press
  const handlePress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    //if (e.key === 'Enter') parentFunction?.();
  };

  return (
    <Wrapper>
      <button onKeyDown={handlePress} onClick={handleClick} className="button">
        {children}
      </button>
    </Wrapper>
  );
}

export default Button;
