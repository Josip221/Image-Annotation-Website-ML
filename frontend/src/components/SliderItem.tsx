import React, { useContext } from 'react';
import styled from 'styled-components';
import { Context } from '../context/context';
import { SliderItemProps } from '../@interfaces/other';
import { ContextProps } from '../@interfaces/interfaces';

const Wrapper = styled.div`
  .slider-item {
    &:hover {
      cursor: pointer;
    }
    position: relative;
    box-sizing: border-box;
    padding: 0.1em;
    width: 100%;
    border-radius: 10px;
    background-color: whitesmoke;
    box-shadow: inset 0 -3em 3em rgba(0, 0, 0, 0.1),
      0 0 0 2px rgb(255, 255, 255), 0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
  }
  .slider-item_active {
    //border: 4px ${props => props.theme.colors.button} solid;
    background-color: floralwhite;
  }

  .slider-photo {
    border-radius: 10px;
    width: 150px;
    height: 80px;
    vertical-align: top;
    object-fit: 'contain';
    object-position: top;
  }
`;

function SliderItem({ active = false, img, index }: SliderItemProps) {
  const { setCurrentImageIndex } = useContext(Context) as ContextProps;

  const handleClick = () => {
    setCurrentImageIndex(index);
  };
  return (
    <Wrapper onClick={handleClick}>
      <div className={`slider-item ${active && 'slider-item_active'}`}>
        <img className="slider-photo" alt="idk" src={img} />
        No: {index + 1}
        <div>img_0000.jpg</div>
      </div>
    </Wrapper>
  );
}

export default SliderItem;
