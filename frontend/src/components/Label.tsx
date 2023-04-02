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
`;

function Label({ label }: { label: LabelProp }) {
  return (
    <Wrapper>
      <div>
        x1: {label.x1} x2: {label.x2} y1: {label.y1} y2: {label.y2}
      </div>
    </Wrapper>
  );
}

export default Label;
