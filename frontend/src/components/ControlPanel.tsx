import React from 'react';
import Button from './Button';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5em;
  margin: 1em 0;
`;

function ControlPanel() {
  return (
    <Wrapper>
      <Button>Submit</Button>
      <Button>Next sequence</Button>
    </Wrapper>
  );
}

export default ControlPanel;
