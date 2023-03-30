import React, { useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  parentFunction: (value: string) => void;
}

function Input({ label, type, placeholder, parentFunction }: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: string | undefined = inputRef.current?.value;
    if (newValue) parentFunction(newValue);
  };
  return (
    <Wrapper>
      <label>{label}</label>
      <input
        type={type}
        ref={inputRef}
        placeholder={placeholder}
        onChange={handleInputChange}
      />
    </Wrapper>
  );
}

export default Input;
