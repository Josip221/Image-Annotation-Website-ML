import React, { useContext, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Context } from '../context/context';
import { SliderItemProps } from '../@interfaces/other';
import { ContextProps, ImageRect } from '../@interfaces/interfaces';
import Canvas from './Canvas';

const Wrapper = styled.div`
  position: relative;
  .slider-item {
    display: flex;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
    box-sizing: border-box;
    padding: 0.1em;
    gap: 2em;
    width: 100%;
    border-radius: 10px;
    background-color: transparent;
  }
  .slider-item_active {
    border: 1px ${props => props.theme.colors.button} solid;
  }

  .slider-photo {
    border-radius: 10px;
    width: 300px;
    vertical-align: top;
    object-fit: 'contain';
    object-position: top;
  }
`;

function SliderItem({ active = false, img, name, index }: SliderItemProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const { setCurrentImageIndex, fullScreenWidth } = useContext(
    Context
  ) as ContextProps;
  const [scale, setScale] = useState(1);
  const [rect, setRect] = useState<ImageRect>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const handleClick = () => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setRect({
        top: Math.round(rect.y),
        left: Math.round(rect.x),
        width: rect.width,
        height: rect.height,
      });

      setScale(1 / +(fullScreenWidth / imageRef.current.width).toFixed(1));
    }
  }, [fullScreenWidth, img]);

  return (
    <Wrapper onClick={handleClick}>
      <div className={`slider-item ${active && 'slider-item_active'}`}>
        <img ref={imageRef} className="slider-photo" alt="idk" src={img} />
        <Canvas
          rect={{
            top: 2,
            left: 2,
            width: rect.width,
            height: rect.height,
          }}
          scale={scale}
          index={index}
          strokeWidth={1}
        />
        <div>{name}</div>
      </div>
    </Wrapper>
  );
}

export default SliderItem;
