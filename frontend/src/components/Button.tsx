import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.button`
  all: unset;
`;

function Button({ children }: { children: string }) {
  return <Wrapper>{children}</Wrapper>;
}

export default Button;
