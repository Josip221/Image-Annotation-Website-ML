import React, { useState } from 'react';
import { checkNewPolygon } from '../label_processing/label_processing';
import { fetchRandomSequence } from '../networking/sequenceControllerNetwork';
import { Selection, ContextProps } from '../@interfaces/interfaces';

export const Context = React.createContext<ContextProps | null>(null);

const ContextProvider = ({ children }: any) => {
  const [sequenceData, setSequenceData] = useState<{
    sequenceName: string;

    images: { imageName: string; image: string }[];
  }>({
    sequenceName: 'loading',
    images: [],
  });
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

  const copyPreviousToCurrent = () => {
    const currentImageSelections = selections.filter(
      (el: Selection) => el.imageId === currentImageIndex
    );
    if (currentImageIndex !== 0 && currentImageSelections.length === 0) {
      const prevImageSelections = JSON.parse(JSON.stringify(selections));

      prevImageSelections
        .filter((el: Selection) => el.imageId === currentImageIndex - 1)
        .forEach((item: Selection) => (item.imageId = currentImageIndex));

      setSelections((prevItems: Selection[]) => [
        ...prevItems,
        ...prevImageSelections,
      ]);
    }
  };

  const setImages = async (token: string): Promise<number> => {
    const response = await fetchRandomSequence(token);
    if (response.data.images) {
      const base64Mod = response.data.images.map(
        (item: { imageName: string; image: string }) => {
          return {
            imageName: item.imageName,
            image: 'data:image/jpeg;base64,' + item.image,
          };
        }
      );
      setSequenceData({
        sequenceName: response.data.sequenceName,
        images: base64Mod,
      });
      return 1;
    } else {
      return 0;
    }
  };

  const clearAll = () => {
    setSelections([]);
    setSequenceData({
      sequenceName: 'loading',
      images: [],
    });
  };
  return (
    <Context.Provider
      value={{
        setSelections,
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
        copyPreviousToCurrent,
        setImages,
        sequenceData,
        setSequenceData,
        clearAll,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
