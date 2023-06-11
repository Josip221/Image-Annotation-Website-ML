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
          console.log('delete it');
          //allPolygons.splice(allPolygons.indexOf(polygon), 1);
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
        number[0] *= scale;
        number[1] *= scale;
      });
    });
  });
  return temp;
};
