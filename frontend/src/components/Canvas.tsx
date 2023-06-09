import React, { useEffect, useContext, useState, useRef } from 'react';
import styled from 'styled-components';
import { Context } from '../context/context';
import { Selection, Edge, ContextProps } from '../@interfaces/interfaces';

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
  ) as ContextProps;

  const [currentSelections, setCurrentSelections] = useState<Selection[] | []>(
    []
  );

  useEffect(() => {
    const filter = selections.filter(
      (el: Selection) => el.imageId === currentImageIndex
    );

    setCurrentSelections(filter);
  }, [selections, currentImageIndex]);

  useEffect(() => {
    console.log(currentSelections);
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
      {currentSelections &&
        currentSelections.map((item: Selection, i: number) => {
          return (
            <svg key={i}>
              {item.selection.edges.map((edge: Edge, i: number) => {
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
