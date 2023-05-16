import React, { useContext } from 'react';
import styled from 'styled-components';
import SliderItem from './SliderItem';
import { Context } from '../context/context';
import { ContextProps } from '../@interfaces/interfaces';
import { SliderProps } from '../@interfaces/other';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
  margin-top: 1em;
`;

function Slider({ sliderInfo }: SliderProps) {
  const { currentImageIndex } = useContext(Context) as ContextProps;
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
