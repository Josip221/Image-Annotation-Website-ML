import { ImageRect } from '../@interfaces/interfaces';
import {
  Edge,
  Selection,
  Coord,
  Intersection,
} from '../@interfaces/interfaces';

export const getAllCoordsOfRectangle = (
  startCoords: Coord,
  endCoords: Coord,
  imageRect: ImageRect
): Edge[] => {
  const x1: Coord = {
    x: startCoords.x - imageRect.left,
    y: startCoords.y - imageRect.top,
  };
  const x2: Coord = {
    x: endCoords.x - imageRect.left,
    y: startCoords.y - imageRect.top,
  };
  const x3: Coord = {
    x: endCoords.x - imageRect.left,
    y: endCoords.y - imageRect.top,
  };
  const x4: Coord = {
    x: startCoords.x - imageRect.left,
    y: endCoords.y - imageRect.top,
  };
  return [
    [
      [x1.x, x1.y],
      [x2.x, x2.y],
    ],
    [
      [x2.x, x2.y],
      [x3.x, x3.y],
    ],
    [
      [x3.x, x3.y],
      [x4.x, x4.y],
    ],
    [
      [x4.x, x4.y],
      [x1.x, x1.y],
    ],
  ];
};

// polygons[0][0][0]. First is the polygon. Second is the edge. Thrid is the edge point

// TODO:
// check if new polgyon is not 0width/height
// check if new polgyon is inside our encapsulates an existing polgyon...

// paul borke
const checkIfEdgesIntersect = (a: Edge, b: Edge): Coord | false => {
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

// find top,left,right and bot of a polygon, for checking

//for each polgyon //FIX ANY STUFF CANT BE BOTHERED RN
export const checkNewPolygon = (
  newPolygon: Selection,
  allPolygons: Selection[]
): Intersection | false => {
  let intersectionData: Intersection = {
    selectionId: -1,
    intersectingEdges: [],
    coord: [],
  };

  if (allPolygons.length > 0) {
    newPolygon.selection.edges.forEach((newEdge: Edge) => {
      allPolygons.forEach((polygon: Selection) => {
        polygon.selection.edges.forEach((edge: Edge) => {
          const intersectionCoord: Coord | false = checkIfEdgesIntersect(
            newEdge,
            edge
          );
          if (intersectionCoord) {
            intersectionData.intersectingEdges.push(newEdge, edge);
            intersectionData.selectionId = polygon.selection.selectionId;
            intersectionData.coord.push(intersectionCoord);
          }
        });
      });
    });
  }
  console.log('how many intersects', intersectionData);

  //console.log(intersectionData);
  if (intersectionData.selectionId !== -1) {
    return intersectionData;
  }

  return false;
};

export const mergePolygons = (
  newPolygon: Selection,
  oldPolygon: Selection,
  intersection: Intersection
): Edge[] => {
  const poly1 = oldPolygon.selection.edges.filter((edge: Edge) => {
    const test1 = isVertexOnEdge(
      intersection.intersectingEdges[0][0][0],
      intersection.intersectingEdges[0][1][1],
      edge[0][0],
      edge[0][1],
      edge[1][0],
      edge[1][1]
    );

    const test2 = isVertexOnEdge(
      intersection.intersectingEdges[1][0][0],
      intersection.intersectingEdges[1][1][1],
      edge[0][0],
      edge[0][1],
      edge[1][0],
      edge[1][1]
    );

    if (test1 || test2) {
      return false;
    } else return true;
  });

  const poly2 = newPolygon.selection.edges.filter((edge: Edge) => {
    const test1 = isVertexOnEdge(
      intersection.intersectingEdges[0][0][0],
      intersection.intersectingEdges[0][1][1],
      edge[0][0],
      edge[0][1],
      edge[1][0],
      edge[1][1]
    );

    const test2 = isVertexOnEdge(
      intersection.intersectingEdges[1][0][0],
      intersection.intersectingEdges[1][1][1],
      edge[0][0],
      edge[0][1],
      edge[1][0],
      edge[1][1]
    );

    if (test1 || test2) {
      return false;
    } else return true;
  });

  const concatPoly = poly1.concat(poly2);
  const newPoly = sortPointsClockwise(concatPoly);

  console.log(newPoly);
  return newPoly.concat(connectHolesInEdges(newPoly, intersection));
};

// sorts edges clockwise
const sortPointsClockwise = (edges: Edge[]): Edge[] => {
  // find center
  const center = edges.reduce(
    (acc, [p1, p2]: any) => [acc[0] + p1[0] + p2[0], acc[1] + p1[1] + p2[1]],
    [0, 0]
  );
  center[0] /= edges.length * 2;
  center[1] /= edges.length * 2;

  // Step 2: Calculate the angle of each edge
  const angles = edges.map((edge: Edge) => {
    const dx = edge[0][0] - center[0];
    const dy = edge[1][0] - center[1];
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  });

  // Step 3: Sort the edges based on their angle
  const sortedEdges = edges.slice().sort((a, b) => {
    const angleA = angles[edges.indexOf(a)];
    const angleB = angles[edges.indexOf(b)];
    return angleB - angleA;
  });

  return sortedEdges;
};

const connectHolesInEdges = (edges: Edge[], intersection: Intersection) => {
  const considerationEdges: Edge[] = [];
  const newEdges: Edge[] = [];
  //find open edges
  for (let i = 0; i < edges.length; i++) {
    //console.log(edges[i]);
    if (edges[i + 1]) {
      if (JSON.stringify(edges[i][1]) !== JSON.stringify(edges[i + 1][0])) {
        considerationEdges.push([edges[i][1], edges[i + 1][0]]);
      }
    } else {
      if (JSON.stringify(edges[i][1]) !== JSON.stringify(edges[0][0])) {
        //considerationEdges.push([edges[i][1], edges[0][0]]);
      }
    }
  }

  console.log(considerationEdges);
  considerationEdges.forEach(edge => {
    newEdges.push(...connectThreeDots(intersection, edge[0], edge[1]));
  });

  return newEdges;
};

const connectThreeDots = (
  intersection: Intersection,
  first: [number, number],
  second: [number, number]
): Edge[] => {
  const newEdgeSection: Edge[] = [];
  Object.values(intersection.coord).forEach((interEdge, i) => {
    //push if the angles are 90, meaning they should have an x or y in common
    console.log(first, second, interEdge);
    if (
      (first[0] === interEdge.x || first[1] === interEdge.y) &&
      (second[0] === interEdge.x || second[1] === interEdge.y)
    ) {
      console.log(i);
      newEdgeSection.push([first, [interEdge.x, interEdge.y]]);
      newEdgeSection.push([[interEdge.x, interEdge.y], second]);
    }
  });

  return newEdgeSection;
};

// stackoverflow
function isVertexOnEdge(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): boolean {
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

// case 1: new selection contains previous rectangle

// case 2: one vertex inside existing rectangles: check all 4 sides, top left, top right, bottom left, bottom right
// case 3: one vertex inside existing rectangles: check all 4 sides, top left, top right, bottom left, bottom right
// case 4: one vertex inside existing rectangles: check all 4 sides, top left, top right, bottom left, bottom right
// case 5: new selection contains a previous select inside

// deletion as well
