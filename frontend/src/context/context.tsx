import React, { useState } from 'react';
import { checkNewPolygon } from '../label_processing/label_processing';

interface Selection {
  imageId: number;
  selection: {
    selectionId: number;
    dots: { x: number; y: number }[];
  };
}

// spagethi code
interface ContextProps {
  selections: {
    imageId: number;
    selection: { selectionId: number; dots: { x: number; y: number }[] };
  }[];
  currentImageIndex: number;
  currentImageRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setCurrentImageRect: React.Dispatch<
    React.SetStateAction<{
      top: number;
      left: number;
      width: number;
      height: number;
    }>
  >;
  addNewSelection: (newItem: Selection) => void;
}

export const Context = React.createContext<ContextProps | null>(null);

const ContextProvider = ({ children }: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImageRect, setCurrentImageRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const [selections, setSelections] = useState<any>([]);

  const addNewSelection = (newItem: any) => {
    //newItem width cant be 0

    const filteredAllSelections = selections.filter(
      (el: any) => el.imageId === currentImageIndex
    );

    //first check for merges
    //if any two selections should merge, merge 2 into 1.
    //else just make a new singular selection
    checkNewPolygon(newItem, filteredAllSelections);
    setSelections((prevItems: any) => [...prevItems, newItem]);
  };

  // const deleteSelection = () => {};

  // const clearAll = () => {};
  return (
    <Context.Provider
      value={{
        selections,
        addNewSelection,
        currentImageIndex,
        setCurrentImageIndex,
        currentImageRect,
        setCurrentImageRect,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
