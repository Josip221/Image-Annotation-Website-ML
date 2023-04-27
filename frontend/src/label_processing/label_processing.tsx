interface Coord {
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
  startCoords: Coord,
  endCoords: Coord,
  imageRect: Rect
) => {
  //top
  const x1 = {
    x: startCoords.x - imageRect.left,
    y: startCoords.y - imageRect.top,
  };
  const x2 = {
    x: endCoords.x - imageRect.left,
    y: startCoords.y - imageRect.top,
  };
  //bottom
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

interface polygon {
  [index: number]: edge;
}

interface edge {
  [index: number]: [number, number];
}

let polygons: polygon[] = [
  [
    [
      [0, 0],
      [20, 0],
    ],
    [
      [20, 0],
      [20, 20],
    ],
    [
      [20, 20],
      [0, 20],
    ],
    [
      [0, 20],
      [0, 0],
    ],
  ],
];

const newPolygonThatShouldBeChecked: polygon = [
  [
    [0, 0],
    [20, 0],
  ],
  [
    [20, 0],
    [20, 20],
  ],
  [
    [20, 20],
    [0, 20],
  ],
  [
    [0, 20],
    [0, 0],
  ],
];

// polygons[0][0][0]. First is the polygon. Second is the edge. Thrid is the edge point

// check if new polgyon is inside our encapsulates an existing polgyon...

const checkIfEdgesIntersect = (a: edge, b: edge) => {
  const x1 = a[0][0];
  const x2 = a[1][0];
  const y1 = a[0][1];
  const y2 = a[1][1];

  const x3 = b[0][0];
  const x4 = b[1][0];
  const y3 = b[0][1];
  const y4 = b[1][1];

  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  const denominator: number = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  if (denominator === 0) {
    return false;
  }
  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);
  return { x, y };
};

//EDGE IS A CONNECTION BETWEEN TWO
// VERTEX IS A POINT

//CHECK IF TWO OVERLAP FOR STARTERS

//NEW POLYGON IS CREATED, CHECK ITS EDGES THROUGH ALL OTHER EDGES OF EXISTING POLYGONS

//IF NO INTERSECT, GOOD

//IF INTERSECT, PUT NEW POLYGON INSIDE OF EXISTING ONE, BUT REARANGE THE VERTICES CORRECTLY

//run when new polygon created

//for each polgyon
export const checkNewPolygon = (newItem: any) => {
  console.log(newItem);
  polygons.forEach(polygon => {
    //for each edge in polygon
    Object.values(polygon).forEach(edge => {
      // here check intersection
      // Object.values(newPolygonThatShouldBeChecked).forEach(newEdge =>
      //   console.log(checkIfEdgesIntersect(edge, newEdge))
      // );
    });
  });
};
