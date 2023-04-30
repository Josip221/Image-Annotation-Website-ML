import React, { useState } from 'react';
import {
  checkNewPolygon,
  mergePolygons,
} from '../label_processing/label_processing';

import { Selection, ContextProps } from '../@interfaces/interfaces';

export const Context = React.createContext<ContextProps | {}>({});

const ContextProvider = ({ children }: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImageRect, setCurrentImageRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const [selections, setSelections] = useState<Selection[]>([]);

  const addNewSelection = (newItem: any) => {
    //newItem width cant be 0

    //
    console.log('selections object', selections);
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
        (el: Selection) => el.selection.selectionId === intersection.selectionId
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
      const prevItems = selections.filter((el: Selection) => {
        console.log(el);
        return (
          el.selection.selectionId !== intersection.selectionId &&
          el.imageId !== currentImageIndex
        );
      });

      setSelections([...prevItems, newItem]);
    } else {
      setSelections((prevItems: Selection[]) => [...prevItems, newItem]);
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
