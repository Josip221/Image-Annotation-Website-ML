import React, { useContext } from 'react';
import Button from './Button';
import styled from 'styled-components';
import { Context } from '../context/context';
import { ContextProps } from '../@interfaces/interfaces';
import { sendMarkedSequence } from '../networking/sequenceControllerNetwork';
import { useAuth } from '../context/auth';
import { Selection, Edge } from '../@interfaces/interfaces';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5em;
  margin: 1em 0;
`;

function ControlPanel() {
  const { selections, fullImageRatioToOg } = useContext(
    Context
  ) as ContextProps;

  const { token }: any = useAuth();

  const handleSubmit = () => {
    console.log('before multiply', selections);
    // multiply all numbers by the scale factor

    const temp = JSON.parse(JSON.stringify(selections));

    console.log('deep copy', temp);
    temp.forEach((selection: Selection) => {
      selection.selection.edges.forEach((edge: any) => {
        edge.forEach((number: [number, number]) => {
          number[0] *= fullImageRatioToOg;
          number[1] *= fullImageRatioToOg;
        });
      });
    });

    sendMarkedSequence(temp, token);
  };
  return (
    <Wrapper>
      <Button parentFunction={handleSubmit}>Submit</Button>
      <Button>Next sequence</Button>
    </Wrapper>
  );
}

export default ControlPanel;
