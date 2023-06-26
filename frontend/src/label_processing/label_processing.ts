import { convertToObject } from 'typescript';
import { ImageRect } from '../@interfaces/interfaces';
import { Edge, Selection, Coord } from '../@interfaces/interfaces';
import * as martinez from 'martinez-polygon-clipping';
const geometric = require('geometric');
export const getAllCoordsOfRectangle = (
  startCoords: Coord,
  endCoords: Coord,
  imageRect: ImageRect,
  zoomOffScale: { x: number; y: number; scale: number }
): Edge[] => {
  const x1: Coord = {
    x: startCoords.x - imageRect.left - zoomOffScale.x,
    y: startCoords.y - imageRect.top - zoomOffScale.y,
  };
  const x2: Coord = {
    x: endCoords.x - imageRect.left - zoomOffScale.x,
    y: startCoords.y - imageRect.top - zoomOffScale.y,
  };
  const x3: Coord = {
    x: endCoords.x - imageRect.left - zoomOffScale.x,
    y: endCoords.y - imageRect.top - zoomOffScale.y,
  };
  const x4: Coord = {
    x: startCoords.x - imageRect.left - zoomOffScale.x,
    y: endCoords.y - imageRect.top - zoomOffScale.y,
  };
  return [
    [
      [x1.x / zoomOffScale.scale, x1.y / zoomOffScale.scale],
      [x2.x / zoomOffScale.scale, x2.y / zoomOffScale.scale],
    ],
    [
      [x2.x / zoomOffScale.scale, x2.y / zoomOffScale.scale],
      [x3.x / zoomOffScale.scale, x3.y / zoomOffScale.scale],
    ],
    [
      [x3.x / zoomOffScale.scale, x3.y / zoomOffScale.scale],
      [x4.x / zoomOffScale.scale, x4.y / zoomOffScale.scale],
    ],
    [
      [x4.x / zoomOffScale.scale, x4.y / zoomOffScale.scale],
      [x1.x / zoomOffScale.scale, x1.y / zoomOffScale.scale],
    ],
  ];
};
// polygons[0][0][0]. First is the polygon. Second is the edge. Thrid is the edge point

//allPolyongs are all current image
export const checkNewPolygon = (
  newPolygon: Selection,
  allPolygons: Selection[],
  action: string
) => {
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
      //check if new inside old
      if (geometric.polygonInPolygon(polyB, polyA)) {
        intersection--;
      }
      //check if old inside new
      if (geometric.polygonInPolygon(polyA, polyB)) {
        if (action === 'draw') {
          polygon.selection.edges = newPolygon.selection.edges;
        } else if (action === 'delete') {
          polygon.selection.edges = [];
        }
        intersection--;
      }
    });
    if (intersection) return allPolygons;
  }
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

export const adjustToScale = (selections: Selection[], scale: number) => {
  const temp = JSON.parse(JSON.stringify(selections));
  temp.forEach((selection: Selection) => {
    selection.selection.edges.forEach((edge: any) => {
      edge.forEach((number: [number, number]) => {
        number[0] = Math.round(number[0] * scale);
        number[1] = Math.round(number[1] * scale);
      });
    });
  });
  return temp;
};
