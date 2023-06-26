import React, { useState } from 'react';
import { checkNewPolygon } from '../label_processing/label_processing';

import { Selection, ContextProps } from '../@interfaces/interfaces';

export const Context = React.createContext<ContextProps | null>(null);

const ContextProvider = ({ children }: any) => {
  const [fullImageRatioToOg, setFullImageRatioToOg] = useState<number>(1);
  const [fullScreenWidth, setFullScreenWidth] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImageRect, setCurrentImageRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const [selections, setSelections] = useState<Selection[]>([]);

  const addNewSelection = (newSelection: Selection, action: string) => {
    //newSelection width cant be 1x1
    if (
      JSON.stringify(newSelection.selection.edges[0]) ===
      JSON.stringify(newSelection.selection.edges[2])
    ) {
      return 0;
    }

    const currentImageSelections = selections.filter(
      (el: Selection) => el.imageId === currentImageIndex
    );

    newSelection.selection.selectionId = currentImageSelections.length;

    const intersection = checkNewPolygon(
      newSelection,
      currentImageSelections,
      action
    );

    if (intersection === 0) {
      setSelections((prevItems: Selection[]) => [...prevItems, newSelection]);
    } else {
      setSelections((prevItems: Selection[]) => [
        ...prevItems.filter(item => item.selection.edges.length > 0),
      ]);
    }
  };

  const clearAllSelections = () => {
    setSelections([]);
  };
  return (
    <Context.Provider
      value={{
        selections,
        addNewSelection,
        currentImageIndex,
        setCurrentImageIndex,
        currentImageRect,
        setCurrentImageRect,
        fullImageRatioToOg,
        setFullImageRatioToOg,
        fullScreenWidth,
        setFullScreenWidth,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
