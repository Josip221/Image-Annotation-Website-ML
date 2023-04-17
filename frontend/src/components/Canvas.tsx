import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  //background-color: rgb(255, 255, 0, 0.15);
`;

interface CanvasProps {
  dots: { x: number; y: number }[];
}

const Canvas = ({ dots }: CanvasProps) => {
  return (
    <Wrapper>
      <svg>
        {dots &&
          dots.map((dot, i) => {
            return (
              <line
                x1={dots[i].x}
                y1={dots[i].y}
                x2={dots[i + 1] ? dots[i + 1].x : dots[0].x}
                y2={dots[i + 1] ? dots[i + 1].y : dots[0].y}
                stroke="red"
                strokeWidth="1"
              />
            );
          })}
      </svg>
    </Wrapper>
  );
};

export default Canvas;
