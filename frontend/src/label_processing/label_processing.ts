import { ImageRect } from '../@interfaces/interfaces';
import { Edge, Selection, Coord } from '../@interfaces/interfaces';
import * as martinez from 'martinez-polygon-clipping';
const geometric = require('geometric');
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

//allPolyongs are all current image
export const checkNewPolygon = (
  newPolygon: Selection,
  allPolygons: Selection[],
  action: string
): number => {
  let intersection = 0;
  if (allPolygons.length > 0) {
    const polyB = toVerticesArrayFromMyFormat(newPolygon.selection.edges);

    //geometric check if polygons intersect
    //works

    allPolygons.forEach((polygon: Selection) => {
      const polyA = toVerticesArrayFromMyFormat(polygon.selection.edges);
      const intersects = geometric.polygonIntersectsPolygon(polyA, polyB);
      if (intersects) {
        if (action === 'draw') {
          const martinezZ = martinez.union(
            fromMyToMartinezFormat(polygon.selection.edges),
            fromMyToMartinezFormat(newPolygon.selection.edges)
          );
          const finalEdges = fromMartinezToMyFormat(martinezZ);
          polygon.selection.edges = finalEdges;
          intersection++;
        } else if (action === 'delete') {
          const martinezZ = martinez.diff(
            fromMyToMartinezFormat(polygon.selection.edges),
            fromMyToMartinezFormat(newPolygon.selection.edges)
          );
          const finalEdges = fromMartinezToMyFormat(martinezZ);
          polygon.selection.edges = finalEdges;
          intersection++;
        }
      }
      //check if inside one another
      if (geometric.polygonInPolygon(polyB, polyA)) {
        intersection--;
      }
    });
    return intersection;
  }
  // if (intersectionData.selectionId !== -1) {
  //   return intersectionData;
  // }

  return 0;
};

const fromMyToMartinezFormat = (selection: Edge[]): martinez.Geometry => {
  const map = selection.map(edge => edge[0]);
  map.push(selection[0][0]);
  return [[map]];
};

const fromMartinezToMyFormat = (martinezSelection: martinez.Geometry) => {
  martinezSelection[0][0].pop();
  let edges: any = [];
  martinezSelection[0][0].forEach((item, i) => {
    if (martinezSelection[0][0][i + 1]) {
      const edge = [item, martinezSelection[0][0][i + 1]];
      edges.push(edge);
    } else {
      const edge = [item, martinezSelection[0][0][0]];
      edges.push(edge);
    }
  });

  return edges;
};

const toVerticesArrayFromMyFormat = (edges: Edge[]) => {
  return edges.map(edge => edge[0]);
};

const toMyFormatFromVerticesArray = (edges: Edge[]) => {};

// // console.log(mappy);
// // console.log(martinez);
// // console.log([
// //   [
// //     [
// //       [18.5, 89.5],
// //       [90, -141.5],
// //       [178.5, -181.5],
// //       [184, 79.5],
// //       [18.5, 89.5],
// //     ],
// //     [
// //       [112.5, -108.5],
// //       [72, 57.5],
// //       [162, 59.5],
// //       [158, -132],
// //       [112.5, -108.5],
// //     ],
// //   ],
// // ]);
