import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { imgUrls } from '../networking/mockupImgs';
import Slider from '../components/Slider';

const Wrapper = styled.div`
  width: 100%;
`;

const ImageWrapper = styled.div`
  width: 600px;
  display: flex;

  .main-image {
    vertical-align: top;
    width: 100%;
    object-fit: contain;
    cursor: pointer;
  }

  .main-image-fullscreen {
    position: absolute;
    object-fit: contain;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    pointer-events: none;
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
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState(false);

  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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

  useEffect(() => {
    if (imageRef.current) imageRef.current.src = imgUrls[currentImageIndex].img;
  }, [currentImageIndex]);

  const handleMouseDown = (event: React.MouseEvent) => {
    let x = 0;
    let y = 0;
    const { clientX, clientY } = event;
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      x = clientX - rect.left;
      y = clientY - rect.top;
    }
    setStartCoords({ x: x, y: y });
    setEndCoords({ x: x, y: y });
    setIsDrawing(true);
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDrawing && imageRef.current) {
      const { clientX, clientY } = event;
      const rect = imageRef.current.getBoundingClientRect();
      let newEndCoords = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
      setEndCoords(newEndCoords);
    }
  };

  const handleMouseUp = (): void => {
    console.log(startCoords, endCoords);
    console.log(`Width: ${Math.abs(startCoords.x - endCoords.x)} px`);
    console.log(`Height: ${Math.abs(startCoords.y - endCoords.y)} px`);
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  return (
    <Wrapper id="dashboard">
      <ImageWrapper
        id="image-wrapper"
        ref={imageWrapperRef}
        tabIndex={0}
        onClick={handleMainImageClick}
        onKeyDown={handleKeyClick}
      >
        <img
          ref={imageRef}
          id="main-image"
          className={isFullscreen ? 'main-image-fullscreen' : 'main-image'}
          src={imgUrls[0].img}
          alt="select smoke"
        />
        {isDrawing && (
          <div
            style={{
              position: 'absolute',
              border: '2px dashed red',
              left: Math.min(startCoords.x, endCoords.x),
              top: Math.min(startCoords.y, endCoords.y),
              width: Math.abs(endCoords.x - startCoords.x),
              height: Math.abs(endCoords.y - startCoords.y),
            }}
          />
        )}
        {isFullscreen && (
          <div
            id="selection-box"
            className="selection-box"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
          />
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
