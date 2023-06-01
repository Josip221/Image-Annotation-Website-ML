import React, { useContext } from 'react';
import Button from './Button';
import styled from 'styled-components';
import { Context } from '../context/context';
import { ContextProps } from '../@interfaces/interfaces';
import { sendMarkedSequence } from '../networking/sequenceControllerNetwork';
import { useAuth } from '../context/auth';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5em;
  margin: 1em 0;
`;

function ControlPanel() {
  const { selections } = useContext(Context) as ContextProps;

  const { token }: any = useAuth();

  const handleSubmit = () => {
    console.log(selections);
    sendMarkedSequence(selections, token);
  };
  return (
    <Wrapper>
      <Button parentFunction={handleSubmit}>Submit</Button>
      <Button>Next sequence</Button>
    </Wrapper>
  );
}

export default ControlPanel;
