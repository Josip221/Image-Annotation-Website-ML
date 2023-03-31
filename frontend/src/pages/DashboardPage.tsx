import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1em;

  .img-container {
    position: relative;
    user-select: none;
  }
  .img {
    object-fit: contain;
    width: 800px;
    border: 2px solid red;
    pointer-events: none;
  }
`;

function DashboardPage() {
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [drawing, setDrawing] = useState(false);
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
      <div className="img-container">
        <img
          className="img"
          ref={imageRef}
          alt="smoke "
          src="https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/thumbnails/image/repeat_fire_in_AK_June2015_RLoehman_0.JPG"
        />
        {drawing && (
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
        <div
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
        />
      </div>
    </Wrapper>
  );
}

export default DashboardPage;
