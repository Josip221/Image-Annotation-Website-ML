import React from 'react';
import styled from 'styled-components';
interface Props {
  type: string;
  startCoords: { x: number; y: number };
  endCoords: { x: number; y: number };
}

const Wrapper = styled.div<any>`
  position: absolute;
  border: 2px ${props => (props.type === 'draw' ? 'dashed blue' : 'dashed red')};
`;

function SelectBox({ startCoords, endCoords, type }: Props) {
  return (
    <Wrapper
      type={type}
      style={{
        left: Math.min(startCoords.x, endCoords.x),
        top: Math.min(startCoords.y, endCoords.y),
        width: Math.abs(endCoords.x - startCoords.x),
        height: Math.abs(endCoords.y - startCoords.y),
      }}
    />
  );
}

export default SelectBox;
