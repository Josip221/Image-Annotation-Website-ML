export interface ContextProps {
  selections: Selection[];
  currentImageIndex: number;
  currentImageRect: ImageRect;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setCurrentImageRect: React.Dispatch<React.SetStateAction<ImageRect>>;
  addNewSelection: (newItem: Selection, action: string) => void;
  fullImageRatioToOg: number;
  setFullImageRatioToOg: React.Dispatch<React.SetStateAction<number>>;
  fullScreenWidth: number;
  setFullScreenWidth: React.Dispatch<React.SetStateAction<number>>;
  copyPreviousToCurrent: () => void;
  setImages: (token: string) => Promise<number>;
  sequenceData: {
    sequenceName: string;
    images: { imageName: string; image: string }[];
  };
  clearAll: () => void;
  setSequenceData: React.Dispatch<
    React.SetStateAction<{
      sequenceName: string;
      images: {
        imageName: string;
        image: string;
      }[];
    }>
  >;
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
