import { read } from 'fs';
import React from 'react';
import styled from 'styled-components';
interface Props {
  type: string;
  startCoords: { x: number; y: number };
  endCoords: { x: number; y: number };
  rect: { top: number; left: number };
}

const Wrapper = styled.div<any>`
  position: absolute;
  border: 2px ${props => (props.type === 'draw' ? 'dashed red' : 'dashed blue')};
`;

function SelectBox({ startCoords, endCoords, type, rect }: Props) {
  return (
    <Wrapper
      type={type}
      style={{
        left: Math.min(startCoords.x, endCoords.x) - rect.left,
        top: Math.min(startCoords.y, endCoords.y) - rect.top,
        width: Math.abs(endCoords.x - startCoords.x),
        height: Math.abs(endCoords.y - startCoords.y),
      }}
    />
  );
}

export default SelectBox;
