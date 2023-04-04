import React, { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';

interface LabelProp {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.second};
  border-radius: 10px;
  padding: 0 0.5em;

  &:hover {
    background-color: ${props => props.theme.colors.third};
  }

  .label-header {
    display: flex;
    justify-content: space-between;
  }
`;

interface Props {
  label: LabelProp;
  index: number;
  deleteLabel: (index: number) => void;
}

function Label({ label, index, deleteLabel }: Props) {
  let rectangle: Element | null;
  const handleHoverOn = () => {
    rectangle = document.querySelector(
      `.done-rectangle[data-set-key="${index}"]`
    );
    console.log(rectangle);
    //console.log(rectangle);
    if (rectangle) {
      rectangle.classList.add('done-rectangle-active');
    }
    //rectangle.
  };
  const handleHoverOff = () => {
    if (rectangle) {
      rectangle.classList.remove('done-rectangle-active');
    }
    //rectangle.
  };

  const handleDeleteClick = () => {
    deleteLabel(index);
  };

  return (
    <Wrapper onMouseLeave={handleHoverOff} onMouseEnter={handleHoverOn}>
      <div className="label-header">
        <span>Label: {index + 1}</span>
        <span onClick={handleDeleteClick}>X</span>
      </div>
      <div>
        x1: {label.x1} x2: {label.x2} y1: {label.y1} y2: {label.y2}
      </div>
    </Wrapper>
  );
}

export default Label;
