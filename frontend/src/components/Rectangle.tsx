import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
`;

interface RectangleProps {
  startCoords: { x: number; y: number };
  endCoords: { x: number; y: number };
  draw?: boolean;
  select?: boolean;
  remove?: boolean;
}

function Rectangle({
  startCoords,
  endCoords,
  draw,
  remove,
  select,
}: RectangleProps) {
  return (
    <Wrapper
      style={{
        left: Math.min(startCoords.x, endCoords.x),
        top: Math.min(startCoords.y, endCoords.y),
        width: Math.abs(endCoords.x - startCoords.x),
        height: Math.abs(endCoords.y - startCoords.y),
        border: draw
          ? '1px solid blue'
          : select
          ? '1px solid green'
          : remove
          ? '1px solid red'
          : '1px solid red',
      }}
    ></Wrapper>
  );
}

export default Rectangle;
