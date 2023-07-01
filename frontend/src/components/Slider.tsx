import React, { useContext } from 'react';
import styled from 'styled-components';
import SliderItem from './SliderItem';
import { Context } from '../context/context';
import { ContextProps } from '../@interfaces/interfaces';
import { SliderProps } from '../@interfaces/other';

const Wrapper = styled.div`
  display: grid;
  width: 70%;
  grid-template-columns: repeat(auto-fill, minmax(800px, 1fr));
  gap: 1em;
  margin: 1em;
  max-height: 100%;
  overflow: auto;
`;

function Slider({ sliderInfo }: SliderProps) {
  console.log('data', sliderInfo);
  const { currentImageIndex } = useContext(Context) as ContextProps;
  return (
    <Wrapper>
      {sliderInfo.map((item, index) => {
        console.log(item);
        return (
          <SliderItem
            active={currentImageIndex === index ? true : false}
            key={index}
            index={index}
            img={item.image}
            name={item.imageName}
          />
        );
      })}
    </Wrapper>
  );
}

export default Slider;
