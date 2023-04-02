import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  .slider-item {
    &:hover {
      background-color: ${props => props.theme.colors.third};
      cursor: pointer;
    }
    width: 100%;
    background-color: ${props => props.theme.colors.second};
  }
  .slider-item_active {
    border: 2px red solid;
  }

  .slider-photo {
    width: 100%;
    object-fit: 'cover';
  }
`;

interface SliderItemProps {
  active?: boolean;
  img: string;
}

function SliderItem({ active = false, img }: SliderItemProps) {
  return (
    <Wrapper>
      <div className={`slider-item ${active && 'slider-item_active'}`}>
        <img className="slider-photo" alt="idk" src={img} />
      </div>
    </Wrapper>
  );
}

export default SliderItem;
