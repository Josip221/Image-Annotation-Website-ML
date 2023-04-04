import React from 'react';
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

function Label({
  label,
  index,
  deleteLabel,
}: {
  label: LabelProp;
  index: number;
  deleteLabel: (index: number) => void;
}) {
  const rectangle = ReactDOM.findDOMNode(
    document.querySelector(`.done-rectangle[data-set-key="${index}"]`)
  );
  const handleHover = () => {
    console.log(rectangle);
    //rectangle.
  };

  const handleDeleteClick = () => {
    deleteLabel(index);
  };

  return (
    <Wrapper onMouseEnter={handleHover}>
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
