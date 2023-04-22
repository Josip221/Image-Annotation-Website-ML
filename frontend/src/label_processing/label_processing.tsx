interface Coords {
  x: number;
  y: number;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const getAllCoordsOfRectangle = (
  startCoords: Coords,
  endCoords: Coords,
  imageRect: Rect
) => {
  const x1 = {
    x: startCoords.x - imageRect.left,
    y: startCoords.y - imageRect.top,
  };
  const x2 = {
    x: endCoords.x - imageRect.left,
    y: startCoords.y - imageRect.top,
  };
  const x3 = {
    x: endCoords.x - imageRect.left,
    y: endCoords.y - imageRect.top,
  };
  const x4 = {
    x: startCoords.x - imageRect.left,
    y: endCoords.y - imageRect.top,
  };
  return [x1, x2, x3, x4];
};

// export const check = () => {
//   for (let i = 0; i < dots.length; i++) {
//     if (i === dots.length - 1) {
//       console.log(
//         `Line ${i + 1}: \n From x ${dots[i].x} y ${dots[i].y}\n To x ${
//           dots[0].x
//         } y ${dots[0].y}\n`
//       );
//     } else {
//       console.log(
//         `Line ${i + 1}: \n From x ${dots[i].x} y ${dots[i].y}\n To x ${
//           dots[i + 1].x
//         } y ${dots[i + 1].y}\n`
//       );
//     }
//   }
// };

//check collisions
