interface CoordProps {
  startCoords: { x: number; y: number };
  endCoords: { x: number; y: number };
}

interface Dots {
  dot: { x: number; y: number }[];
}

export const getAllCoordsOfRectangle = ({
  startCoords,
  endCoords,
}: CoordProps) => {
  // z pattern for coords. A rectangle has 4 dots x1 x2 x3 x4
  //   const x1 = startCoords.x;
  //   const x2 = endCoords.x;
  //   const x3 = startCoords.x;
  //   const x4 = endCoords.x;
  //   const y1 = startCoords.y;
  //   const y2 = startCoords.y;
  //   const y3 = endCoords.y;
  //   const y4 = endCoords.y;
  //   console.log(`Point 1: x1 ${x1} y1 ${y1}\n`);
  //   console.log(`Point 2: x2 ${x2} y2 ${y2}\n`);
  //   console.log(`Point 3: x3 ${x3} y3 ${y3}\n`);
  //   console.log(`Point 4: x4 ${x4} y4 ${y4}\n`);
};

//USE JS CANVAS CLIP() FOR MERGING TWO RECTANGLES, CHECK FIRST IF THEY INTERSECT
