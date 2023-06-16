import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { imgUrls } from '../networking/mockupImgs';
import { getAllCoordsOfRectangle } from '../label_processing/label_processing';
import Slider from '../components/Slider';
import SelectBox from '../components/SelectBox';
import Canvas from '../components/Canvas';
import { ContextProps, ImageRect } from '../@interfaces/interfaces';
import { Context } from '../context/context';
import ControlPanel from '../components/ControlPanel';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: flex-start;
`;

const ImageWrapper = styled.div`
  width: 800px;
  margin: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .main-image {
    vertical-align: top;
    width: 100%;

    object-fit: contain;
    cursor: pointer;
    box-shadow: inset 0 -3em 3em rgba(0, 0, 0, 0.1),
      0 0 0 2px rgb(255, 255, 255), 0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
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
    cursor: crosshair;
    z-index: 10;
  }
`;

function DashboardPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  //for select box
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState({ active: false, type: 'draw' });

  //refs
  const wrapperRef = useRef(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // document.addEventListener('keydown', event => {
  //   console.log(event.key);
  // });
  //context data
  const {
    addNewSelection,
    setCurrentImageIndex,
    currentImageIndex,
    currentImageRect,
    setCurrentImageRect,
    setFullImageRatioToOg,
    fullScreenWidth,
    setFullScreenWidth,
  } = useContext(Context) as ContextProps;

  const toggleFullscreen = () => setIsFullscreen(prevVal => !prevVal);

  const handleMainImageClick = (event: React.MouseEvent) => {
    event.preventDefault();

    if (!isFullscreen && event.target instanceof HTMLImageElement)
      toggleFullscreen();
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

      setStartCoords({
        x,
        y,
      });
      setEndCoords({ x, y });
      if (event.button === 0)
        setIsDrawing({ active: true, type: 'draw' }); // event 0 is left click
      else if (event.button === 2)
        setIsDrawing({ active: true, type: 'delete' });
    }
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDrawing.active && imageRef.current) {
      setEndCoords({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const handleMouseUp = (event: React.MouseEvent): void => {
    event.preventDefault();

    addNewSelection(
      {
        imageId: currentImageIndex,
        selection: {
          selectionId: 0,
          edges: getAllCoordsOfRectangle(
            startCoords,
            endCoords,
            currentImageRect
          ),
        },
      },
      isDrawing.type
    );
    setIsDrawing(prev => ({ type: prev.type, active: false }));
  };

  const handleMouseLeave = () => {
    if (isDrawing.active)
      setIsDrawing(prev => ({ type: prev.type, active: false }));
  };

  useEffect(() => {
    //console.log('fetch image sequence here');
  }, []);

  useEffect(() => {
    if (isFullscreen && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setCurrentImageRect({
        top: Math.round(rect.y),
        left: Math.round(rect.x),
        width: rect.width,
        height: rect.height,
      });
      //ratio
      const nwidth = imageRef.current?.naturalWidth;
      const width = imageRef.current?.width;
      setFullScreenWidth(width);
      if (nwidth && width) setFullImageRatioToOg(+(nwidth / width).toFixed(2));
    }
    if (!isFullscreen && imageRef.current && fullScreenWidth !== 0) {
      const rect = imageRef.current.getBoundingClientRect();
      setCurrentImageRect({
        top: Math.round(rect.y),
        left: Math.round(rect.x),
        width: rect.width,
        height: rect.height,
      });
      const width = imageRef.current?.width;
      if (width) setScale(+(fullScreenWidth / width).toFixed(2));
    }
  }, [
    isFullscreen,
    fullScreenWidth,
    setFullScreenWidth,
    setCurrentImageRect,
    currentImageIndex,
    setFullImageRatioToOg,
    scale,
  ]);

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
          <>
            <img
              ref={imageRef}
              className="main-image"
              src={imgUrls[currentImageIndex].img}
              alt="select smoke"
            />
            <Canvas
              rect={currentImageRect}
              scale={1 / scale}
              index={currentImageIndex}
              strokeWidth={2}
            />
          </>
        )}
        {isFullscreen && (
          <div className="container-fullscreen">
            <TransformWrapper
              ref={wrapperRef}
              onPanningStart={(ref, e: any) => {
                //console.log(e.button);
              }}
              panning={{ activationKeys: ['Alt'] }}
              onZoomStop={(ref, e) => {
                console.log(ref.state.scale);
                console.log(currentImageRect);
                // setCurrentImageRect((prevRect: ImageRect) => {
                //   return { top: 0, left: 0, width: 0, height: 0 };
                // });
                setZoomScale(ref.state.scale);
              }}
              maxScale={2.5}
              minScale={1}
            >
              <TransformComponent>
                <img
                  ref={imageRef}
                  className="main-image-fullscreen"
                  src={imgUrls[currentImageIndex].img}
                  alt="select smoke"
                ></img>
                <div
                  className="selection-box"
                  style={{
                    // top: currentImageRect.top,
                    // left: currentImageRect.left,
                    top: 0,
                    left: 0,
                    width: `${currentImageRect.width}px`,
                    height: `${currentImageRect.height}px`,
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                />
                <Canvas
                  rect={{
                    top: 0,
                    left: 0,
                    width: currentImageRect.width,
                    height: currentImageRect.height,
                  }}
                  scale={1}
                  index={currentImageIndex}
                  strokeWidth={2}
                />
                {
                  <SelectBox
                    type={isDrawing.type}
                    startCoords={startCoords}
                    endCoords={endCoords}
                    rect={{
                      top: currentImageRect.top,
                      left: currentImageRect.left,
                      // top: 0,
                      // left: 0,
                    }}
                    zoom={zoomScale}
                  />
                }
              </TransformComponent>
            </TransformWrapper>
          </div>
        )}
        <ControlPanel />
      </ImageWrapper>

      {!isFullscreen && <Slider sliderInfo={imgUrls} />}
    </Wrapper>
  );
}

export default DashboardPage;
