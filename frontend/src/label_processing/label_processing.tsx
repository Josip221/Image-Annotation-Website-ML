//dots
const dots: { x: number; y: number }[] = [
  { x: 50, y: 50 },
  { x: 50, y: 100 },
  { x: 200, y: 100 },
  { x: 200, y: 150 },
  { x: 200, y: 200 },
  { x: 250, y: 200 },
  { x: 250, y: 50 },
];

export const getAllCoordsOfRectangle = ({
  startCoords,
  endCoords,
}: {
  startCoords: { x: number; y: number };
  endCoords: { x: number; y: number };
}) => {
  console.log(startCoords, endCoords);
};

export const check = () => {
  for (let i = 0; i < dots.length; i++) {
    if (i === dots.length - 1) {
      console.log(
        `Line ${i + 1}: \n From x ${dots[i].x} y ${dots[i].y}\n To x ${
          dots[0].x
        } y ${dots[0].y}\n`
      );
    } else {
      console.log(
        `Line ${i + 1}: \n From x ${dots[i].x} y ${dots[i].y}\n To x ${
          dots[i + 1].x
        } y ${dots[i + 1].y}\n`
      );
    }
  }
};
