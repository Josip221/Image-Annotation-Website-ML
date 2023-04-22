import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  svg {
    height: 100%;
    width: 100%;
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
    <Wrapper
      style={{
        top: currentImageRect.top,
        left: currentImageRect.left,
        width: `${currentImageRect.width}px`,
        height: `${currentImageRect.height}px`,
      }}
    >
      <svg>
        {dots &&
          dots.map((dot, i) => {
            return (
              <line
                key={i}
                x1={dots[i].x - currentImageRect.left}
                y1={dots[i].y - currentImageRect.top}
                x2={
                  dots[i + 1]
                    ? dots[i + 1].x - currentImageRect.left
                    : dots[0].x - currentImageRect.left
                }
                y2={
                  dots[i + 1]
                    ? dots[i + 1].y - currentImageRect.top
                    : dots[0].y - currentImageRect.top
                }
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
