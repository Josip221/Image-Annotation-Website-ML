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
  const x1 = [startCoords.x - imageRect.left, startCoords.y - imageRect.top];
  const x2 = [endCoords.x - imageRect.left, startCoords.y - imageRect.top];
  const x3 = [endCoords.x - imageRect.left, endCoords.y - imageRect.top];
  const x4 = [startCoords.x - imageRect.left, endCoords.y - imageRect.top];
  return [
    [x1, x2],
    [x2, x3],
    [x3, x4],
    [x4, x1],
  ];
};

interface polygon {
  [index: number]: edge;
}

interface edge {
  [index: number]: [number, number];
}

// polygons[0][0][0]. First is the polygon. Second is the edge. Thrid is the edge point

// TODO:
// check if new polgyon is not 0width/height
// check if new polgyon is inside our encapsulates an existing polgyon...

// paul borke
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
  return [x, y];
};

//EDGE IS A CONNECTION BETWEEN TWO
// VERTEX IS A POINT

//CHECK IF TWO OVERLAP FOR STARTERS

//NEW POLYGON IS CREATED, CHECK ITS EDGES THROUGH ALL OTHER EDGES OF EXISTING POLYGONS

//IF NO INTERSECT, GOOD

//IF INTERSECT, PUT NEW POLYGON INSIDE OF EXISTING ONE, BUT REARANGE THE VERTICES CORRECTLY

//run when new polygon created

// find top,left,right and bot of a polygon, for checking

//for each polgyon //FIX ANY STUFF CANT BE BOTHERED RN
export const checkNewPolygon = (newPolygon: any, allPolygons: any) => {
  let intersectionData: any = { selectionId: -1, dots: [] };

  if (allPolygons.length > 0) {
    newPolygon.selection.edges.forEach((newEdge: any) => {
      allPolygons.forEach((polygon: any) => {
        polygon.selection.edges.forEach((edge: any) => {
          const intersectionEdge = checkIfEdgesIntersect(newEdge, edge);
          if (intersectionEdge) {
            intersectionData.dots.push(intersectionEdge);
            intersectionData.selectionId = polygon.selection.selectionId;
          }
        });
      });
    });
  }
  if (intersectionData.selectionId !== -1) {
    return intersectionData;
  }

  return false;
};

export const mergePolygons = (
  newPolygon: any,
  oldPolygon: any,
  intersection: any
) => {
  // console.log(newPolygon.selection.edges);
  // console.log(oldPolygon.selection.edges);
  // console.log(intersection);

  const poly1 = oldPolygon.selection.edges.filter(
    (edge: any, index: number) => {
      const test1 = isVertexOnEdge(
        intersection.dots[0][0],
        intersection.dots[0][1],
        edge[0][0],
        edge[0][1],
        edge[1][0],
        edge[1][1]
      );

      const test2 = isVertexOnEdge(
        intersection.dots[1][0],
        intersection.dots[1][1],
        edge[0][0],
        edge[0][1],
        edge[1][0],
        edge[1][1]
      );

      if (test1 || test2) {
        return false;
      } else return true;
    }
  );

  const poly2 = newPolygon.selection.edges.filter(
    (edge: any, index: number) => {
      const test1 = isVertexOnEdge(
        intersection.dots[0][0],
        intersection.dots[0][1],
        edge[0][0],
        edge[0][1],
        edge[1][0],
        edge[1][1]
      );

      const test2 = isVertexOnEdge(
        intersection.dots[1][0],
        intersection.dots[1][1],
        edge[0][0],
        edge[0][1],
        edge[1][0],
        edge[1][1]
      );

      if (test1 || test2) {
        return false;
      } else return true;
    }
  );
  return poly1.concat(poly2);
};

// stackoverflow ty
function isVertexOnEdge(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  var A = x - x1;
  var B = y - y1;
  var C = x2 - x1;
  var D = y2 - y1;

  var dot = A * C + B * D;
  var len_sq = C * C + D * D;
  var param = -1;
  if (len_sq !== 0)
    //in case of 0 length line
    param = dot / len_sq;

  var xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  var dx = x - xx;
  var dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy) < 0.1;
}
