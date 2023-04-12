import React from 'react';
import styled from 'styled-components';
import SliderItem from './SliderItem';

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 50px 1fr 50px;
  gap: 0.2em;

  .slider {
    grid-area: 1/2/1/3;
    display: flex;
    justify-content: space-between;
    gap: 5px;
  }
`;

interface SliderProps {
  sliderInfo: { img: string }[];
  handleSliderImageClick: (imageIndex: number) => void;
  selectedImageIndex: number;
}

function Slider({
  sliderInfo,
  handleSliderImageClick,
  selectedImageIndex,
}: SliderProps) {
  return (
    <Wrapper>
      <div className="slider">
        {sliderInfo.map((item, index) => {
          return (
            <SliderItem
              handleImageClick={handleSliderImageClick}
              active={selectedImageIndex === index ? true : false}
              key={index}
              index={index}
              img={item.img}
            />
          );
        })}
      </div>
    </Wrapper>
  );
}

export default Slider;
