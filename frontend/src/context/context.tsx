import React, { useState } from 'react';
import {
  checkNewPolygon,
  mergePolygons,
} from '../label_processing/label_processing';

interface Selection {
  imageId: number;
  selection: {
    selectionId: number;
    edges: { x: number; y: number }[];
  };
}

// spagethi code
interface ContextProps {
  selections: {
    imageId: number;
    selection: { selectionId: number; edges: [number, number][][] };
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

    //

    const filteredAllSelections = selections.filter(
      (el: any) => el.imageId === currentImageIndex
    );

    newItem.selection.selectionId = filteredAllSelections.length;

    //first check for merges
    //if any two selections should merge, merge 2 into 1.
    //else just make a new singular selection

    const intersection = checkNewPolygon(newItem, filteredAllSelections);
    if (intersection) {
      const filteredSelectionById = filteredAllSelections.filter(
        (el: any) => el.selection.selectionId === intersection.selectionId
      );

      const updatedSelection = mergePolygons(
        newItem,
        filteredSelectionById[0],
        intersection
      );

      newItem.selection.edges = updatedSelection;
      newItem.selection.selectionId =
        filteredSelectionById[0].selection.selectionId;

      console.log(selections);
      const prevItems = selections.filter((el: any) => {
        console.log(el);
        return (
          el.selection.selectionId !== intersection.selectionId &&
          el.imageId !== currentImageIndex
        );
      });
      console.log(prevItems);
      setSelections([...prevItems, newItem]);
    } else {
      setSelections((prevItems: any) => [...prevItems, newItem]);
    }
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
