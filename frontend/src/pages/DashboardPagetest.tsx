// import React, { useState, useRef, useEffect } from 'react';
// import styled from 'styled-components';
// import Label from '../components/Label';
// import Slider from '../components/Slider';
// import Button from '../components/Button';
// import Rectangle from '../components/Rectangle';

// const Wrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-direction: column;
//   padding: 1em;

//   .img-container {
//     position: relative;
//     user-select: none;
//     grid-area: 1/3/2/4;
//     margin-bottom: 50px;
//   }
//   .img {
//     width: 100%;
//     height: 100%;
//     object-fit: contain;
//     pointer-events: none;
//   }
//   .select-box {
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     cursor: pointer;
//     z-index: 1;
//   }
//   .draw-rectangle {
//     position: absolute;
//     border: 2px dashed ${props => props.theme.colors.second};
//   }

//   .done-rectangle {
//     position: absolute;
//     border: 2px solid ${props => props.theme.colors.second};
//   }

//   .done-rectangle-active {
//     border: 2px solid orange;
//     &::before {
//       position: absolute;
//       content: 'Label';
//       top: -20px;
//     }
//   }

//   .image-grid {
//     width: 100%;
//     display: grid;
//     grid-template-rows: 1fr;
//     grid-template-columns: 100px 50px 2fr 50px 1fr 100px;
//   }

//   .arrow {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     cursor: pointer;
//   }

//   .arrow-left {
//     grid-area: 1/2/1/3;
//   }

//   .arrow-right {
//     grid-area: 1/4/1/5;
//   }

//   .labels {
//     grid-area: 1/5/2/6;
//     display: flex;
//     justify-content: start;
//     flex-direction: column;
//     gap: 5px;
//   }
// `;

// const sliderInfo = [
//   {
//     img: 'https://ec.europa.eu/research-and-innovation/sites/default/files/hm/field/image/wildfire-1826204_1280.jpg',
//   },
//   {
//     img: 'https://ec.europa.eu/research-and-innovation/sites/default/files/hm/field/image/wildfire-1826204_1280.jpg',
//   },
//   {
//     img: 'https://ec.europa.eu/research-and-innovation/sites/default/files/hm/field/image/wildfire-1826204_1280.jpg',
//   },
//   {
//     img: 'https://ec.europa.eu/research-and-innovation/sites/default/files/hm/field/image/wildfire-1826204_1280.jpg',
//   },
//   {
//     img: 'https://ec.europa.eu/research-and-innovation/sites/default/files/hm/field/image/wildfire-1826204_1280.jpg',
//   },
// ];

// interface LabelProp {
//   x1: number;
//   x2: number;
//   y1: number;
//   y2: number;
// }

// function DashboardPage() {
//   const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
//   const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
//   const [drawing, setDrawing] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [labels, setLabels] = useState<LabelProp[]>([]);
//   const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
//   const imageRef = useRef<HTMLImageElement>(null);

//   const disableContextMenu = (event: React.MouseEvent) => {
//     event.preventDefault();
//   };

//   const handleMouseDown = (event: React.MouseEvent) => {
//     let x = 0,
//       y = 0;
//     const { clientX, clientY } = event;
//     if (imageRef.current) {
//       const rect = imageRef.current.getBoundingClientRect();
//       x = clientX - rect.left;
//       y = clientY - rect.top;
//     }

//     setStartCoords({ x: x, y: y });
//     setEndCoords({ x: x, y: y });
//     setDrawing(true);
//   };

//   const handleMouseMove = (event: React.MouseEvent) => {
//     if (drawing && imageRef.current) {
//       const { clientX, clientY } = event;
//       const rect = imageRef.current.getBoundingClientRect();
//       let newEndCoords = {
//         x: clientX - rect.left,
//         y: clientY - rect.top,
//       };
//       setEndCoords(newEndCoords);
//     }
//   };

//   const handleMouseUp = (): void => {
//     setDrawing(false);
//     const newLabel: LabelProp = {
//       x1: startCoords.x,
//       x2: endCoords.x,
//       y1: Math.round(startCoords.y),
//       y2: Math.round(endCoords.y),
//     };
//     setLabels(prev => [...prev, newLabel]);
//   };

//   const handleMouseLeave = () => {
//     setDrawing(false);
//   };

//   const handleSliderImageClick = (imageIndex: number) => {
//     setSelectedImageIndex(imageIndex);
//   };

//   const deleteLabel = (index: number) => {
//     const updatedLabels = [...labels];
//     updatedLabels.splice(index, 1);
//     setLabels(updatedLabels);
//   };

//   useEffect(() => {
//     setLabels([]);
//   }, [selectedImageIndex]);

//   const fullscreenToggle = () => {
//     document.querySelector('.img-container')?.requestFullscreen();
//   };

//   return (
//     <Wrapper>
//       <div>
//         If you see fire, label it! If you don't see the fire, skip the image.
//         <Button onClick={fullscreenToggle}>Go fullscreen!</Button>
//       </div>
//       <div className="image-grid">
//         <div className="img-container">
//           <img
//             className="img"
//             ref={imageRef}
//             alt="forest"
//             src={sliderInfo[selectedImageIndex].img}
//           />
//           {drawing && (
//             <Rectangle draw startCoords={startCoords} endCoords={endCoords} />
//           )}
//           {labels &&
//             labels.map((item, index) => (
//               <Rectangle
//                 data-set-key={index}
//                 key={index}
//                 startCoords={{ x: item.x1, y: item.y1 }}
//                 endCoords={{ x: item.x2, y: item.y2 }}
//               />
//             ))}
//           <div
//             className="select-box"
//             onContextMenu={disableContextMenu}
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseLeave={handleMouseLeave}
//             onMouseUp={handleMouseUp}
//           />
//         </div>
//         <div className="labels">
//           {labels &&
//             labels.map((item, index) => {
//               return (
//                 <Label
//                   deleteLabel={deleteLabel}
//                   key={index}
//                   index={index}
//                   label={item}
//                 />
//               );
//             })}
//         </div>
//       </div>
//       <Slider
//         sliderInfo={sliderInfo}
//         handleSliderImageClick={handleSliderImageClick}
//         selectedImageIndex={selectedImageIndex}
//       />
//     </Wrapper>
//   );
// }

// export default DashboardPage;
import React from 'react';

function DashboardPagetest() {
  return <div></div>;
}

export default DashboardPagetest;
