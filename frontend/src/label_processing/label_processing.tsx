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

function makePolygon(rectangles) {
  let points = calcPoints(rectangles);
  return new Polygon(points);
}

function calcPoints(rectangles) {
  let ret = [];

  let yCoords = [...new Set(getAllYCoords(rectangles).flat())].sort(
    (a, b) => a - b
  );

  let previousLeftCoord = 0;
  let previousRightCoord = 0;

  for (let yCoord of yCoords) {
    console.log('Considering yCoords ' + yCoord);
    let minimumXLeftCoord = minXLeftCoord(yCoord, rectangles);
    let maximumXRightCoord = maxXRightCoord(yCoord, rectangles);
    console.log('min X: ' + minimumXLeftCoord);
    console.log('max X: ' + maximumXRightCoord);

    if (yCoord == yCoords[0]) {
      ret.push([minimumXLeftCoord, yCoord]);
      ret.push([maximumXRightCoord, yCoord]);
    } else {
      if (minimumXLeftCoord != previousLeftCoord) {
        ret.unshift([previousLeftCoord, yCoord]);
        ret.unshift([minimumXLeftCoord, yCoord]);
      } else {
        ret.unshift([minimumXLeftCoord, yCoord]);
      }

      if (maximumXRightCoord != previousRightCoord) {
        ret.push([previousRightCoord, yCoord]);
        ret.push([maximumXRightCoord, yCoord]);
      } else {
        ret.push([maximumXRightCoord, yCoord]);
      }
    }

    previousLeftCoord = minimumXLeftCoord;
    previousRightCoord = maximumXRightCoord;
    console.log(ret);
  }

  return ret;
}

function getAllYCoords(rectangles) {
  let allBottomYCoords = rectangles.map(rectangle => rectangle.bottom.y);
  let allTopYCoords = rectangles.map(rectangle => rectangle.top.y);

  let allCoords = new Set([...allTopYCoords, ...allBottomYCoords]);
  return allCoords;
}

function minXLeftCoord(y, rectangles) {
  return Math.min(...rectanglesAtY(y, rectangles).map(rect => rect.left.x));
}

function maxXRightCoord(y, rectangles) {
  return Math.max(...rectanglesAtY(y, rectangles).map(rect => rect.right.x));
}

function rectanglesAtY(y, rectangles) {
  let rectsAtYExcBottomLines = rectsAtYExcBottomLines(y, rectangles);

  if (rectsAtYExcBottomLines.length > 0) {
    // there are rectangles that are not closing here, so ignore those that are closing.
    return rectsAtYExcBottomLines;
  } else {
    // there are only rectangle bottom lines so we need to consider them.
    return rectsAtYIncBottomLines(y, rectangles);
  }
}

function rectsAtYExcBottomLines(y, rectangles) {
  return rectangles.filter(rect => rect.top.y <= y && rect.bottom.y > y);
}

function rectsAtYIncBottomLines(y, rectangles) {
  return rectangles.filter(rect => rect.top.y <= y && rect.bottom.y == y);
}
