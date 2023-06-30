export interface SliderProps {
  sliderInfo: { imageName: string; image: string }[];
}

export interface SliderItemProps {
  active: boolean;
  img: string;
  index: number;
  name: string;
}
