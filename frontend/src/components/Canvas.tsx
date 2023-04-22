import React, { useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Context } from '../context/context';

const Wrapper = styled.div`
  position: absolute;
  svg {
    height: 100%;
    width: 100%;
  }
`;

const Canvas = () => {
  const { currentImageRect, selections, currentImageIndex } = useContext(
    Context
  ) as any;

  if (selections) {
    const currentSelects = selections.filter(
      (el: any) => el.imageId === currentImageIndex
    );
  }

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
        {/* {selections &&
          selections.map((selection: any, i) => {
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
          })} */}
      </svg>
    </Wrapper>
  );
};

export default Canvas;
