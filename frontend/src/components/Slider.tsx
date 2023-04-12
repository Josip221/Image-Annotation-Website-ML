import React from 'react';
import styled from 'styled-components';
import SliderItem from './SliderItem';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
`;

interface SliderProps {
  sliderInfo: { img: string }[];
  setCurrentImageIndex: (index: number) => void;
  currentImageIndex: number;
}

function Slider({
  sliderInfo,
  setCurrentImageIndex,
  currentImageIndex,
}: SliderProps) {
  const handleClick = (newIndex: number) => {
    console.log(currentImageIndex);
    setCurrentImageIndex(newIndex);
  };
  return (
    <Wrapper>
      {sliderInfo.map((item, index) => {
        return (
          <SliderItem
            onClickHandler={handleClick}
            active={currentImageIndex === index ? true : false}
            key={index}
            index={index}
            img={item.img}
          />
        );
      })}
    </Wrapper>
  );
}

export default Slider;
