import React, { useContext } from 'react';
import Button from './Button';
import styled from 'styled-components';
import { Context } from '../context/context';
import { ContextProps } from '../@interfaces/interfaces';
import { sendMarkedSequence } from '../networking/sequenceControllerNetwork';
import { useAuth } from '../context/auth';
import { adjustToScale } from '../label_processing/label_processing';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5em;
  margin: 1em 0;
  .controls--box {
    display: flex;
    justify-content: end;
    align-items: end;
    flex-direction: column;
    .title1 {
    }
  }
  .controls {
    align-items: end;
    display: flex;
    justify-content: end;
    flex-direction: column;
    font-weight: 400;
    letter-spacing: 1px;
    line-height: 2em;
  }
`;

function ControlPanel() {
  const { selections, fullImageRatioToOg } = useContext(
    Context
  ) as ContextProps;

  const { token }: any = useAuth();

  const handleSubmit = () => {
    sendMarkedSequence(
      adjustToScale(selections, fullImageRatioToOg),
      token,
      'seq20221' //name of seqeunce folder, will fix
    );
  };
  return (
    <Wrapper>
      <Button parentFunction={handleSubmit}>Submit</Button>
      <Button>Submit & Get Next sequence</Button>
      <Button>Next Sequence</Button>
      <div className="controls--box">
        <h1>Controls:</h1>
        <div className="controls">
          <span>A D, ArrowLeft ArrowRight: Move </span>
          <span>Left Click & Drag: Draw </span>
          <span>Right Click & Drag: Delete </span>
          <span>Alt & MiddleScroll: Zoom </span>
          <span>Alt & LeftClick: Pan </span>
          <span>W, ArrowUp: Copy Previous </span>
        </div>
      </div>
    </Wrapper>
  );
}

export default ControlPanel;
