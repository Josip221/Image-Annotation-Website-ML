export interface ContextProps {
  selections: Selection[];
  currentImageIndex: number;
  currentImageRect: ImageRect;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setCurrentImageRect: React.Dispatch<React.SetStateAction<ImageRect>>;
  addNewSelection: (newItem: Selection) => void;
}

export interface Selection {
  imageId: number;
  selection: {
    selectionId: number;
    edges: { x: number; y: number }[];
  };
}
export interface ImageRect {
  top: number;
  left: number;
  width: number;
  height: number;
}
