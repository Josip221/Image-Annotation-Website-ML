import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  svg {
    height: 500px;
    width: 500px;
  }
`;

interface CanvasProps {
  dots: { x: number; y: number }[];
  currentImageRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

const Canvas = ({ dots, currentImageRect }: CanvasProps) => {
  return (
    <Wrapper>
      <svg
        style={{
          top: currentImageRect.top,
          left: currentImageRect.left,
          width: `${currentImageRect.width}px`,
          height: `${currentImageRect.height}px`,
        }}
      >
        {dots &&
          dots.map((dot, i) => {
            return (
              <line
                key={i}
                x1={dots[i].x}
                y1={dots[i].y}
                x2={dots[i + 1] ? dots[i + 1].x : dots[0].x}
                y2={dots[i + 1] ? dots[i + 1].y : dots[0].y}
                stroke="red"
                strokeWidth="2"
              />
            );
          })}
      </svg>
    </Wrapper>
  );
};

export default Canvas;
