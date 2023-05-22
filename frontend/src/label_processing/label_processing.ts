import { Console } from 'console';
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

export const checkNewPolygon = (
  newPolygon: Selection,
  allPolygons: Selection[]
): Intersection | false => {
  let intersectionData: Intersection = {
    imageId: -1,
    selectionId: -1,
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
            polygon.selection.edges.splice(
              polygon.selection.edges.indexOf(edge),
              1
            );
            newPolygon.selection.edges.splice(
              newPolygon.selection.edges.indexOf(newEdge),
              1
            );
            intersectionData.selectionId = polygon.selection.selectionId;
            intersectionData.coord.push(intersectionCoord);
            intersectionData.imageId = newPolygon.imageId;
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
  newPolygon: Selection,
  oldPolygon: Selection,
  intersection: Intersection
): Edge[] => {
  const poly1 = oldPolygon.selection.edges;

  const poly2 = newPolygon.selection.edges;

  const newPoly = sortPointsClockwise(poly1.concat(poly2));
  const connectionEdges = connectHolesInEdges(newPoly, intersection);
  const final = sortPointsClockwise(newPoly.concat(connectionEdges));
  checkIfNewShapeIsClosed(final);
  return final;
};

//still doesnt work
export function sortPointsClockwise(edges: Edge[]): Edge[] {
  // Calculate the center point
  let centerX = 0;
  let centerY = 0;
  const numEdges = edges.length;

  for (const edge of edges) {
    for (const point of Object.values(edge)) {
      centerX += point[0];
      centerY += point[1];
    }
  }

  centerX /= numEdges * 2;
  centerY /= numEdges * 2;

  // Calculate the angles for each edge
  const angles: { index: number; angle: number }[] = [];

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    const point = Object.values(edge)[0];
    const xDiff = point[0] - centerX;
    const yDiff = point[1] - centerY;
    const angle = Math.atan2(yDiff, xDiff);

    angles.push({ index: i, angle: angle });
  }

  // Sort the edges based on angles
  angles.sort((a, b) => a.angle - b.angle);

  // Create a new sorted array
  const sortedEdges: Edge[] = [];

  for (const angle of angles) {
    sortedEdges.push(edges[angle.index]);
  }

  return sortedEdges;
}

const connectHolesInEdges = (edges: Edge[], intersection: Intersection) => {
  const disconnectedPairs: Edge[] = [];
  const newEdges: Edge[] = [];
  //find open edges
  //edges need to be sorted !!
  for (let i = 0; i < edges.length; i++) {
    if (edges[i + 1]) {
      if (edges[i][1] !== edges[i + 1][0]) {
        disconnectedPairs.push([edges[i][1], edges[i + 1][0]]);
      }
    } else {
      if (edges[i][1] !== edges[0][0]) {
        disconnectedPairs.push([edges[i][1], edges[0][0]]);
      }
    }
  }
  disconnectedPairs.forEach(edge => {
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
  Object.values(intersection.coord).forEach(interEdge => {
    if (
      (first[0] === interEdge.x && second[1] === interEdge.y) ||
      (second[0] === interEdge.x && first[1] === interEdge.y)
    ) {
      newEdgeSection.push([first, [interEdge.x, interEdge.y]]);
      newEdgeSection.push([[interEdge.x, interEdge.y], second]);
    }
  });

  return newEdgeSection;
};

// stackoverflow

const checkIfNewShapeIsClosed = (edges: Edge[]) => {
  const openEdges = edges.filter((edge, i) => {
    if (edges[i + 1]) console.log(edges[i + 1]);
    if (edges[i + 1]) return edge[1] !== edges[i + 1][0];
    else return edge[1] !== edges[0][0];
  });
};

//pain
