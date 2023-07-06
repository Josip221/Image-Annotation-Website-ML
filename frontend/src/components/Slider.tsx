import React, { useContext, useRef, useEffect } from 'react';
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

  .container-fullscreen {
    position: absolute;
    display: hidden;
    justify-content: center;
    overflow: hidden;
    z-index: -100;
    align-items: center;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: black;
  }

  .main-image-fullscreen {
    max-width: 100vw;
    max-height: 100vh;
    pointer-events: none;
    background-color: black;
    object-fit: contain;
  }
`;

function Slider({ sliderInfo }: SliderProps) {
  const { currentImageIndex, setFullScreenWidth } = useContext(
    Context
  ) as ContextProps;
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      console.log('test');
      console.log(imageRef.current.width);
      setFullScreenWidth(imageRef.current.width);
    }
  }, [setFullScreenWidth]);
  return (
    <Wrapper>
      {sliderInfo.map((item, index) => {
        return (
          <>
            <SliderItem
              active={currentImageIndex === index ? true : false}
              key={index}
              index={index}
              img={item.image}
              name={item.imageName}
            />
            <div className="container-fullscreen ">
              <img
                ref={imageRef}
                className="main-image-fullscreen"
                src={
                  'https://images.wallpaperscraft.com/image/single/forest_trees_fog_110131_1920x1080.jpg'
                }
                alt="select"
              />
            </div>
          </>
        );
      })}
    </Wrapper>
  );
}

export default Slider;
