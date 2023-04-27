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
              {selection.edges.map((edge: any, i: number) => {
                return (
                  <line
                    key={i}
                    x1={edge[0][0]}
                    y1={edge[0][1]}
                    x2={edge[1][0]}
                    y2={edge[1][1]}
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
