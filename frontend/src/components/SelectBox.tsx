import React from 'react';
import styled from 'styled-components';
interface Props {
  type: string;
  startCoords: { x: number; y: number };
  endCoords: { x: number; y: number };
  rect: { top: number; left: number };
  zoom: number;
}

const Wrapper = styled.div<any>`
  position: absolute;
  border: 2px ${props => (props.type === 'draw' ? 'dashed red' : 'dashed blue')};
`;

function SelectBox({ startCoords, endCoords, type, rect, zoom }: Props) {
  return (
    <Wrapper
      type={type}
      style={{
        left: Math.min(startCoords.x / zoom, endCoords.x / zoom) - rect.left,
        top: Math.min(startCoords.y / zoom, endCoords.y / zoom) - rect.top,
        width: Math.abs(endCoords.x - startCoords.x),
        height: Math.abs(endCoords.y - startCoords.y),
      }}
    />
  );
}

export default SelectBox;
