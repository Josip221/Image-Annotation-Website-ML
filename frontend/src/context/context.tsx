import React, { useState } from 'react';
import {
  checkNewPolygon,
  mergePolygons,
} from '../label_processing/label_processing';

import {
  Selection,
  ContextProps,
  Intersection,
} from '../@interfaces/interfaces';

export const Context = React.createContext<ContextProps | null>(null);

const ContextProvider = ({ children }: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImageRect, setCurrentImageRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const [selections, setSelections] = useState<Selection[]>([]);

  const addNewSelection = (newSelection: Selection) => {
    //newSelection width cant be 0

    //

    const currentImageSelections = selections.filter(
      (el: Selection) => el.imageId === currentImageIndex
    );

    newSelection.selection.selectionId = currentImageSelections.length;

    //first check for merges
    //if any two selections should merge, merge 2 into 1.
    //else just make a new singular selection

    const intersection: Intersection | false = checkNewPolygon(
      newSelection,
      currentImageSelections
    );
    if (intersection) {
      const intersectedSelection: Selection = currentImageSelections.filter(
        (el: Selection) => el.selection.selectionId === intersection.selectionId
      )[0];

      const updatedSelection = mergePolygons(
        newSelection,
        intersectedSelection,
        intersection
      );

      newSelection.selection.edges = updatedSelection;
      newSelection.selection.selectionId =
        intersectedSelection.selection.selectionId;
      const prevItemWithoutSelectedTarget = currentImageSelections.filter(
        (el: Selection) => {
          //console.log(el, currentImageIndex, intersection);
          return el.selection.selectionId !== intersection.selectionId;
        }
      );

      prevItemWithoutSelectedTarget.push(newSelection);

      setSelections(prevItemWithoutSelectedTarget);
    } else {
      console.log(newSelection);
      setSelections((prevItems: Selection[]) => [...prevItems, newSelection]);
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

//provjeri set seleciton, nesto je obrnuto na [i +1], [0] checku
