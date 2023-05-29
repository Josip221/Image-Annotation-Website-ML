import React, { useContext } from 'react';
import styled from 'styled-components';
import SliderItem from './SliderItem';
import { Context } from '../context/context';
import { ContextProps } from '../@interfaces/interfaces';
import { SliderProps } from '../@interfaces/other';

const Wrapper = styled.div`
  display: grid;
  width: 70%;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.5em;
  margin: 1em;
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
