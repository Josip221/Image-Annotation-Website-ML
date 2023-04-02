import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import SliderItem from '../components/SliderItem';
import Button from '../components/Button';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1em;

  .img-container {
    position: relative;
    user-select: none;
    grid-area: 1/3/2/4;
  }
  .img {
    width: 100%;
    object-fit: contain;
    border: 2px solid red;
    pointer-events: none;
  }
  .select-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
  }
  .draw-rectangle {
    position: absolute;
    border: 2px dashed red;
  }

  .image-grid {
    width: 100%;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 100px 50px 2fr 50px 1fr 100px;
  }

  .arrow {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .arrow-left {
    grid-area: 1/2/1/3;
  }

  .arrow-right {
    grid-area: 1/4/1/5;
  }

  .labels {
    grid-area: 1/5/2/6;
    display: flex;
    justify-content: start;
    flex-direction: column;
    gap: 5px;
  }

  .label {
    background-color: ${props => props.theme.colors.second};
    border-radius: 10px;
    padding: 0.2em;
  }

  .label-button {
    margin-top: auto;
  }

  .slider-container {
    width: 100%;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 50px 1fr 50px;
    gap: 0.2em;
  }

  .slider {
    grid-area: 1/2/1/3;
    display: flex;
    justify-content: space-between;
    gap: 5px;
  }
`;
const img =
  'https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/thumbnails/image/repeat_fire_in_AK_June2015_RLoehman_0.JPG';

const sliderInfo = [
  {
    img: img,
  },
  {
    img: img,
  },
  {
    img: img,
  },
  {
    img: img,
  },
  {
    img: img,
  },
];

function DashboardPage() {
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [drawing, setDrawing] = useState(false);
  const [labels, setLabels] = useState([]);
  const [selectedImageIndex, setSelectedImage] = useState<0 | 1 | 2 | 3 | 4>(4);
  const imageRef = useRef<HTMLImageElement>(null);

  function handleMouseDown(event: React.MouseEvent) {
    let x = 0,
      y = 0;
    const { clientX, clientY } = event;
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      x = clientX - rect.left;
      y = clientY - rect.top;
    }

    setStartCoords({ x: x, y: y });
    setEndCoords({ x: x, y: y });
    setDrawing(true);
  }

  function handleMouseMove(event: React.MouseEvent) {
    if (drawing && imageRef.current) {
      const { clientX, clientY } = event;
      const rect = imageRef.current.getBoundingClientRect();
      let newEndCoords = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
      setEndCoords(newEndCoords);
    }
  }

  function handleMouseUp() {
    console.log(`x1: ${startCoords.x} y1: ${Math.round(startCoords.y)}`);
    console.log(`x2: ${endCoords.x} y2: ${Math.round(endCoords.y)}`);
    setDrawing(false);
  }

  function handleMouseLeave() {
    setDrawing(false);
  }

  return (
    <Wrapper>
      <div>
        If you see fire, label it! If you don't see the fire, skip the image.
      </div>
      <div className="image-grid">
        <span className="arrow arrow-left">{'<'}</span>
        <div className="img-container">
          <img
            className="img"
            ref={imageRef}
            alt="smoke "
            src={sliderInfo[selectedImageIndex].img}
          />
          {drawing && (
            <div
              className="draw-rectangle"
              style={{
                left: Math.min(startCoords.x, endCoords.x),
                top: Math.min(startCoords.y, endCoords.y),
                width: Math.abs(endCoords.x - startCoords.x),
                height: Math.abs(endCoords.y - startCoords.y),
              }}
            />
          )}
          <div
            className="select-box"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
          />
        </div>
        <span className="arrow arrow-right">{'>'}</span>
        <div className="labels">
          <div className="label">Label 1: Coords................X</div>
          <div className="label">Label 2: Coords................X</div>
          <Button>Send label</Button>
        </div>
      </div>
      <div className="slider-container">
        <div className="slider">
          {sliderInfo.map((item, index) => {
            return (
              <SliderItem
                active={selectedImageIndex === index ? true : false}
                key={index}
                img={item.img}
              />
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
}

export default DashboardPage;
