export interface ContextProps {
  selections: Selection[];
  currentImageIndex: number;
  currentImageRect: ImageRect;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setCurrentImageRect: React.Dispatch<React.SetStateAction<ImageRect>>;
  addNewSelection: (newItem: Selection, action: string) => void;
}

export interface Selection {
  imageId: number;
  selection: {
    selectionId: number;
    edges: Edge[];
  };
}
export interface ImageRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Edge {
  [index: number]: [number, number];
}

export interface Coord {
  x: number;
  y: number;
}

export interface Intersection {
  imageId: number;
  selectionId: number;
  coord: Coord[];
}
