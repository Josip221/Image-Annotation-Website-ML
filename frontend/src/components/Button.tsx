import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  .button {
    all: unset;
    font-weight: 400;
    letter-spacing: 2px;
    cursor: pointer;
    margin: 0.5em;
    border: 1px solid ${props => props.theme.colors.second};
    padding: 0.2em 0.6em;
    &:hover {
      background-color: ${props => props.theme.colors.second};
      transition: all 0.2s;
    }
    &:focus-visible {
      outline: none;

      box-shadow: 0 0 2px 2px ${props => props.theme.colors.second};
      border: 2px solid black;
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
