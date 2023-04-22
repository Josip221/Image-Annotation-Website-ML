import React, { useContext } from 'react';
import styled from 'styled-components';
import { Context } from '../context/context';

const Wrapper = styled.div`
  .slider-item {
    &:hover {
      background-color: ${props => props.theme.colors.second};
      cursor: pointer;
    }
    width: 100%;
    background-color: ${props => props.theme.colors.second};
  }
  .slider-item_active {
    border: 4px ${props => props.theme.colors.button} solid;
  }

  .slider-photo {
    width: 150px;
    height: 80px;
    vertical-align: top;
    object-fit: 'contain';
  }
`;

interface SliderItemProps {
  active?: boolean;
  img: string;
  index: number;
}

function SliderItem({ active = false, img, index }: SliderItemProps) {
  const { setCurrentImageIndex } = useContext(Context) as any; //FIX

  const handleClick = () => {
    setCurrentImageIndex(index);
  };
  return (
    <Wrapper onClick={handleClick}>
      <div className={`slider-item ${active && 'slider-item_active'}`}>
        <img className="slider-photo" alt="idk" src={img} />
      </div>
    </Wrapper>
  );
}

export default SliderItem;
