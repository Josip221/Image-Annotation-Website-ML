import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components';
import { Context } from '../context/context';
import { Selection, Edge } from '../@interfaces/interfaces';

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

  const [currentSelections, setCurrentSelections] = useState<Selection[] | []>(
    []
  ); //fix

  useEffect(() => {
    const filter = selections.filter(
      (el: Selection) => el.imageId === currentImageIndex
    );
    const newSelect = filter.map((item: Selection) => item.selection);
    setCurrentSelections(newSelect);
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
      {/* drawing is okay i guess */}
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
