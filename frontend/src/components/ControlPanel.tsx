import React, { useContext } from 'react';
import Button from './Button';
import styled from 'styled-components';
import { Context } from '../context/context';
import { ContextProps } from '../@interfaces/interfaces';
import { sendMarkedSequence } from '../networking/sequenceControllerNetwork';
import { useAuth } from '../context/auth';
import { adjustToScale } from '../label_processing/label_processing';
import { authContextProps } from '../@interfaces/authContext';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5em;
  margin: 1em 0;
  .controls--box {
    display: flex;
    justify-content: end;
    align-items: start;
    flex-direction: column;
    .title1 {
    }
  }
  .controls {
    align-items: start;
    display: flex;
    justify-content: end;
    flex-direction: column;
    font-weight: 400;
    letter-spacing: 1px;
    line-height: 2em;
  }
  h1 {
    font-family: 'Roboto Slab', serif;
  }

  .button--box {
    display: flex;
  }
`;

function ControlPanel() {
  const { selections, fullImageRatioToOg, clearAll, sequenceData } = useContext(
    Context
  ) as ContextProps;

  const { token, user } = useAuth() as authContextProps;

  const handleSubmit = () => {
    sendMarkedSequence(
      adjustToScale(selections, fullImageRatioToOg),
      sequenceData.sequenceName, //fix later
      sequenceData.images[0].imageName,
      token,
      user,
      sequenceData
    );
    clearAll();
  };

  const handleNext = () => {
    clearAll();
  };
  return (
    <Wrapper>
      <div className="button--box">
        <Button parentFunction={handleSubmit}>Submit & Next Sequence</Button>
        <Button parentFunction={handleNext}>Next Sequence</Button>
      </div>

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
