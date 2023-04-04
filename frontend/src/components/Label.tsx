import React from 'react';
import styled from 'styled-components';

interface LabelProp {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.second};
  border-radius: 10px;
  padding: 0 0.5em;

  .label-header {
    display: flex;
    justify-content: space-between;
  }
`;

function Label({ label, index }: { label: LabelProp; index: number }) {
  return (
    <Wrapper>
      <div className="label-header">
        <span>Label: {index + 1}</span>
        <span>X</span>
      </div>
      <div>
        x1: {label.x1} x2: {label.x2} y1: {label.y1} y2: {label.y2}
      </div>
    </Wrapper>
  );
}

export default Label;
