import React, { useState } from 'react';

interface ContextProps {
  selections: {
    imageId: number;
    selection: { selectionId: number; dots: { x: number; y: number }[] };
  }[];
  currentImageIndex: number;
  setImageIndex: (newValue: number) => void;
}

export const Context = React.createContext<ContextProps | null>(null);

const ContextProvider = ({ children }: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImageRect, setCurrentImageRect] = useState(null);
  const [selections, setSelections] = useState([
    {
      imageId: 0,
      selection: {
        selectionId: 1,
        dots: [
          { x: 10, y: 10 },
          { x: 20, y: 20 },
          { x: 20, y: 20 },
          { x: 20, y: 20 },
        ],
      },
    },
    {
      imageId: 0,
      selection: {
        selectionId: 2,
        dots: [
          { x: 10, y: 10 },
          { x: 20, y: 20 },
          { x: 20, y: 20 },
          { x: 20, y: 20 },
        ],
      },
    },
  ]);

  const setImageIndex = (newIndex: number) => {
    setCurrentImageIndex(newIndex);
  };

  const addNewSelection = () => {};

  const deleteSelection = () => {};

  const clearAll = () => {};
  return (
    <Context.Provider value={{ selections, setImageIndex, currentImageIndex }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
