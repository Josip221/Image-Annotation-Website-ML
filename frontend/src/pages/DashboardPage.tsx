import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { imgUrls } from '../networking/mockupImgs';
import Slider from '../components/Slider';
import SelectBox from '../components/SelectBox';

import { getAllCoordsOfRectangle } from '../label_processing/label_processing';
import Canvas from '../components/Canvas';

const dots = [
  { x: 50, y: 50 },
  { x: 50, y: 100 },
  { x: 200, y: 100 },
  { x: 200, y: 50 },
];

const Wrapper = styled.div``;

const ImageWrapper = styled.div`
  width: 600px;
  height: 400px;
  display: flex;

  .main-image {
    vertical-align: top;
    width: 100%;
    object-fit: contain;
    cursor: pointer;
  }

  .container-fullscreen {
    position: absolute;
    display: flex;
    justify-content: center;
    overflow: hidden;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
  }

  .main-image-fullscreen {
    max-width: 100vw;
    max-height: 100vh;
    pointer-events: none;
    background-color: black;
    //position: absolute;
    object-fit: contain;
    /*
    width: 100%;
    height: 100%;
    background-color: black;
    pointer-events: none; */
  }

  .selection-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    z-index: 1;
  }
`;

function DashboardPage() {
  const [pos, setPos] = useState({ x: 0, y: 0, scale: 1 });
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState({ active: false, type: 'draw' });

  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onScroll = (e: React.WheelEvent) => {
    const delta = e.deltaY * -0.01;
    const newScale = pos.scale + delta;
    //limit zoom
    const minScale = 0;
    const maxScale = 6;
    //console.log('new scale: ', newScale);
    // Check if newScale is within the allowable range
    if (newScale >= minScale && newScale <= maxScale) {
      // if 1, reset everything
      if (newScale === 1) {
        setPos({ scale: 1, x: 0, y: 0 });
        return;
      }
      const ratio = 1 - newScale / pos.scale;
      setPos({
        scale: newScale,
        x: pos.x + (e.clientX - pos.x) * ratio,
        y: pos.y + (e.clientY - pos.y) * ratio,
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prevVal => {
      return !prevVal;
    });
  };

  const handleMainImageClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!isFullscreen) {
      toggleFullscreen();
    }
  };

  const handleKeyClick = (event: React.KeyboardEvent) => {
    if (isFullscreen && event.key === 'Escape') {
      imageWrapperRef.current?.blur();
      toggleFullscreen();
    }

    if (event.key === 'ArrowLeft') {
      if (currentImageIndex === 0) setCurrentImageIndex(imgUrls.length - 1);
      else setCurrentImageIndex(prevIndex => prevIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      if (currentImageIndex === imgUrls.length - 1) setCurrentImageIndex(0);
      else setCurrentImageIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    let x = 0;
    let y = 0;
    const { clientX, clientY } = event;
    if (imageRef.current) {
      //const rect = imageRef.current.getBoundingClientRect();
      x = clientX;
      y = clientY;
      setStartCoords({ x: x, y: y });
      setEndCoords({ x: x, y: y });
      if (event.button === 0) setIsDrawing({ active: true, type: 'draw' });
      else setIsDrawing({ active: true, type: 'delete' });
    }
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDrawing.active && imageRef.current) {
      const { clientX, clientY } = event;
      //const rect = imageRef.current.getBoundingClientRect();
      //actual coords are minus the rect.left and rect.top
      let newEndCoords = {
        x: clientX,
        y: clientY,
      };
      setEndCoords(newEndCoords);
    }
  };

  const handleMouseUp = (): void => {
    console.log(startCoords, endCoords);
    console.log(`Width: ${Math.abs(startCoords.x - endCoords.x)} px`);
    console.log(`Height: ${Math.abs(startCoords.y - endCoords.y)} px`);
    setIsDrawing(prev => ({ type: prev.type, active: false }));
    getAllCoordsOfRectangle({ startCoords, endCoords });
  };

  const handleMouseLeave = () => {
    setIsDrawing(prev => ({ type: prev.type, active: false }));
  };

  return (
    <Wrapper>
      <h1>Camera 10204</h1>
      <h2>Location X</h2>
      <ImageWrapper
        ref={imageWrapperRef}
        tabIndex={0}
        onContextMenu={event => event.preventDefault()} //disable menu on right click
        onClick={handleMainImageClick}
        onKeyDown={handleKeyClick}
      >
        {!isFullscreen && (
          <img
            ref={imageRef}
            className="main-image"
            src={imgUrls[currentImageIndex].img}
            alt="select smoke"
          />
        )}
        {isFullscreen && (
          <div className="container-fullscreen" onWheelCapture={onScroll}>
            <img
              ref={imageRef}
              className="main-image-fullscreen"
              src={imgUrls[currentImageIndex].img}
              alt="select smoke"
              style={{
                transformOrigin: '0 0',
                transform: ` translate(${pos.x}px, ${pos.y}px) scale(${pos.scale})`,
              }}
            ></img>
            <div
              className="selection-box"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
            />

            {isDrawing.active && (
              <SelectBox
                type={isDrawing.type}
                startCoords={startCoords}
                endCoords={endCoords}
              />
            )}
            <Canvas dots={dots} />
          </div>
        )}
      </ImageWrapper>
      <Slider
        sliderInfo={imgUrls}
        setCurrentImageIndex={setCurrentImageIndex}
        currentImageIndex={currentImageIndex}
      />
    </Wrapper>
  );
}

export default DashboardPage;
