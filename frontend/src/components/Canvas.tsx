import React, { useRef, useEffect, useContext, useState } from 'react';
import styled from 'styled-components';
import { Context } from '../context/context';

const Wrapper = styled.div`
  position: absolute;
  svg {
    position: absolute;
    height: 100%;
    width: 100%;
  }
`;

const Canvas = () => {
  const { currentImageRect, selections, currentImageIndex } = useContext(
    Context
  ) as any;

  const [currentSelections, setCurrentSelections] = useState<any>(null); //fix

  useEffect(() => {
    const filter = selections.filter(
      (el: any) => el.imageId === currentImageIndex
    );
    const newSelect = filter.map((item: any) => item.selection);
    setCurrentSelections(newSelect);
  }, [selections, currentImageIndex]);

  useEffect(() => {
    //console.log(currentSelections);
  }, [currentSelections]);

  return (
    <Wrapper
      style={{
        top: currentImageRect.top,
        left: currentImageRect.left,
        width: `${currentImageRect.width}px`,
        height: `${currentImageRect.height}px`,
      }}
    >
      {/* drawing is okay i guess */}
      {currentSelections &&
        currentSelections.map((selection: any, i: number) => {
          return (
            <svg key={i}>
              {selection.dots.map((dot: any, i: number) => {
                return (
                  <line
                    key={i}
                    x1={selection.dots[i].x}
                    y1={selection.dots[i].y}
                    x2={
                      selection.dots[i + 1]
                        ? selection.dots[i + 1].x
                        : selection.dots[0].x
                    }
                    y2={
                      selection.dots[i + 1]
                        ? selection.dots[i + 1].y
                        : selection.dots[0].y
                    }
                    stroke="red"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          );
        })}
    </Wrapper>
  );
};

export default Canvas;
