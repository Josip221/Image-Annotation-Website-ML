import React, { useState } from 'react';

// spagethi code
interface ContextProps {
  selections: {
    imageId: number;
    selection: { selectionId: number; dots: { x: number; y: number }[] };
  }[];
  setSelections: any; // fix this too
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

  const [selections, setSelections] = useState([]);

  const addNewSelection = () => {};

  const deleteSelection = () => {};

  const clearAll = () => {};
  return (
    <Context.Provider
      value={{
        selections,
        setSelections,
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
