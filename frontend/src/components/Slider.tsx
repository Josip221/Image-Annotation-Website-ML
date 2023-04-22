import React, { useContext } from 'react';
import styled from 'styled-components';
import SliderItem from './SliderItem';
import { Context } from '../context/context';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
`;

interface SliderProps {
  sliderInfo: { img: string }[];
}

function Slider({ sliderInfo }: SliderProps) {
  const { currentImageIndex } = useContext(Context) as any; //FIX

  return (
    <Wrapper>
      {sliderInfo.map((item, index) => {
        return (
          <SliderItem
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
