import React, { useState } from 'react';
import { checkNewPolygon } from '../label_processing/label_processing';

import { Selection, ContextProps } from '../@interfaces/interfaces';

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

  const addNewSelection = (newSelection: Selection, action: string) => {
    //newSelection width cant be 0
    const currentImageSelections = selections.filter(
      (el: Selection) => el.imageId === currentImageIndex
    );

    newSelection.selection.selectionId = currentImageSelections.length;

    const intersection: number = checkNewPolygon(
      newSelection,
      currentImageSelections,
      action
    );

    if (intersection === 0) {
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
