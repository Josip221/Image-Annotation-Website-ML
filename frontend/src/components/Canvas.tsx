import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components';
import { Context } from '../context/context';
import {
  Selection,
  Edge,
  ContextProps,
  ImageRect,
} from '../@interfaces/interfaces';
import { adjustToScale } from '../label_processing/label_processing';

const Wrapper = styled.div`
  position: absolute;
  pointer-events: none;
  svg {
    position: absolute;
    height: 100%;
    width: 100%;
  }
`;

const Canvas = ({
  rect,
  scale,
  index,
  strokeWidth,
}: {
  rect: ImageRect;
  scale: number;
  index: number;
  strokeWidth: number;
}) => {
  const { selections } = useContext(Context) as ContextProps;
  const [currentSelections, setCurrentSelections] = useState<Selection[] | []>(
    []
  );

  useEffect(() => {
    const adjustedSelections = adjustToScale(
      selections.filter((el: Selection) => el.imageId === index),
      scale
    );
    setCurrentSelections(adjustedSelections);
  }, [setCurrentSelections, selections, index, scale]);

  return (
    <Wrapper
      style={{
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: `${rect.width}px`,
        height: `${rect.height}px`,
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
                    strokeWidth={strokeWidth}
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
