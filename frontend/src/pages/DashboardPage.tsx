import React, { useState, useRef, useEffect } from 'react';
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
  { x: 250, y: 50 },
  { x: 250, y: 20 },
  { x: 200, y: 20 },
  { x: 50, y: 20 },
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

  .selection-box {
    position: absolute;
    cursor: pointer;
    z-index: 1;
  }
`;

function DashboardPage() {
  const [pos, setPos] = useState({ x: 0, y: 0, scale: 1 });
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [currentImageRect, setCurrentImageRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState({ active: false, type: 'draw' });

  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onScroll = (e: React.WheelEvent) => {
    const delta = e.deltaY * -0.01;
    const newScale = pos.scale + delta;
    const minScale = 1;
    const maxScale = 4;

    if (newScale >= minScale && newScale <= maxScale) {
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
    setIsFullscreen(prevVal => !prevVal);
  };

  const handleMainImageClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!isFullscreen) toggleFullscreen();
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
    if (imageRef.current) {
      let x = event.clientX;
      let y = event.clientY;
      console.log();
      setStartCoords({ x, y });
      setEndCoords({ x, y });
      if (event.button === 0)
        setIsDrawing({ active: true, type: 'draw' }); // event 0 is left click
      else setIsDrawing({ active: true, type: 'delete' });
    }
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDrawing.active && imageRef.current)
      setEndCoords({
        x: event.clientX,
        y: event.clientY,
      });
  };

  const handleMouseUp = (): void => {
    setIsDrawing(prev => ({ type: prev.type, active: false }));
    getAllCoordsOfRectangle({ startCoords, endCoords });
  };

  const handleMouseLeave = () => {
    setIsDrawing(prev => ({ type: prev.type, active: false }));
  };

  useEffect(() => {
    if (isFullscreen && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      console.log(imageRef.current.src);
      // print style top and left of imageref
      console.log(imageRef.current.style.top);

      console.log(rect);
      setCurrentImageRect({
        top: rect.y,
        left: rect.x,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [isFullscreen, currentImageIndex]);

  return (
    <Wrapper>
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
              style={{
                top: currentImageRect.top,
                left: currentImageRect.left,
                width: `${currentImageRect.width}px`,
                height: `${currentImageRect.height}px`,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
            />
            <Canvas dots={dots} />
            {isDrawing.active && (
              <SelectBox
                type={isDrawing.type}
                startCoords={startCoords}
                endCoords={endCoords}
              />
            )}
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
