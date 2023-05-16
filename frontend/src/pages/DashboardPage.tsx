import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { imgUrls } from '../networking/mockupImgs';
import { getAllCoordsOfRectangle } from '../label_processing/label_processing';
import Slider from '../components/Slider';
import SelectBox from '../components/SelectBox';
import Canvas from '../components/Canvas';
import { ContextProps } from '../@interfaces/interfaces';

import { Context } from '../context/context';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const ImageWrapper = styled.div`
  width: 800px;
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  //for select box
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });

  const [isDrawing, setIsDrawing] = useState({ active: false, type: 'draw' });

  //refs
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  //context data

  const {
    addNewSelection,
    setCurrentImageIndex,
    currentImageIndex,
    currentImageRect,
    setCurrentImageRect,
  } = useContext(Context) as ContextProps;

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

  const toggleFullscreen = () => setIsFullscreen(prevVal => !prevVal);

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
      else setCurrentImageIndex(currentImageIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      if (currentImageIndex === imgUrls.length - 1) setCurrentImageIndex(0);
      else setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    if (imageRef.current) {
      let x = event.clientX;
      let y = event.clientY;
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

  const handleMouseUp = (event: React.MouseEvent): void => {
    event.preventDefault();
    setIsDrawing(prev => ({ type: prev.type, active: false }));
    addNewSelection({
      imageId: currentImageIndex,
      selection: {
        selectionId: 0,
        edges: getAllCoordsOfRectangle(
          startCoords,
          endCoords,
          currentImageRect
        ),
      },
    });
  };

  const handleMouseLeave = () => {
    if (isDrawing.active)
      setIsDrawing(prev => ({ type: prev.type, active: false }));
  };

  useEffect(() => {
    if (isFullscreen && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setCurrentImageRect({
        top: Math.round(rect.y),
        left: Math.round(rect.x),
        width: rect.width,
        height: rect.height,
      });
    }
  }, [isFullscreen, setCurrentImageRect, currentImageIndex]);

  return (
    <Wrapper>
      <h2>Camera Marjan 12</h2>
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
            <Canvas />
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
      <Slider sliderInfo={imgUrls} />
    </Wrapper>
  );
}

export default DashboardPage;
