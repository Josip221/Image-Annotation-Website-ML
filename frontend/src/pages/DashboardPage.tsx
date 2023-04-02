import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import SliderItem from '../components/SliderItem';
import Button from '../components/Button';
import Label from '../components/Label';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1em;

  .img-container {
    position: relative;
    user-select: none;
    grid-area: 1/3/2/4;
  }
  .img {
    width: 100%;
    object-fit: contain;
    border: 4px solid red;
    pointer-events: none;
  }
  .select-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
  }
  .draw-rectangle {
    position: absolute;
    border: 2px dashed red;
  }

  .image-grid {
    width: 100%;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 100px 50px 2fr 50px 1fr 100px;
  }

  .arrow {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .arrow-left {
    grid-area: 1/2/1/3;
  }

  .arrow-right {
    grid-area: 1/4/1/5;
  }

  .labels {
    grid-area: 1/5/2/6;
    display: flex;
    justify-content: start;
    flex-direction: column;
    gap: 5px;
  }

  .label {
    background-color: ${props => props.theme.colors.second};
    border-radius: 10px;
    padding: 0.2em;
  }

  .label-button {
    margin-top: auto;
  }

  .slider-container {
    width: 100%;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 50px 1fr 50px;
    gap: 0.2em;
  }

  .slider {
    grid-area: 1/2/1/3;
    display: flex;
    justify-content: space-between;
    gap: 5px;
  }
`;

const sliderInfo = [
  {
    img: 'https://ec.europa.eu/research-and-innovation/sites/default/files/hm/field/image/wildfire-1826204_1280.jpg',
  },
  {
    img: 'https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/thumbnails/image/repeat_fire_in_AK_June2015_RLoehman_0.JPG',
  },
  {
    img: 'https://media.wired.com/photos/5fa04ef7a75d5576fa3a5f12/master/w_2560%2Cc_limit/Science_wildfiresmoke_1229315517.jpg',
  },
  {
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzKH7FXCwo-MPhdUQPBJy6uJ9IUqkUEhUg0P06tIlVs9PBQe-d8TbywC8-OKxexZhpaYU&usqp=CAU',
  },
  {
    img: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUVFRgVFhUYGBgYGhgYGBkZGBgYGBgSGBgaGRgYGBgcIS4lHB4rIRgYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHhISHjQrJCQ0NDQ0NDQ0NDQxNDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0MTQ0NDQ0NDQ0NP/AABEIALQBGQMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAACAwEEBQAGB//EADUQAAEDAwMBBgQFBAMBAAAAAAEAAhEDITEEEkFRBSJhcYGREzKh8EKxwdHhFBVSkgbS8WL/xAAYAQADAQEAAAAAAAAAAAAAAAAAAQIDBP/EAB8RAQEAAgIDAQEBAAAAAAAAAAABAhEDEhMhQTFRYf/aAAwDAQACEQMRAD8AIFPa9VgmgrdmY99kAUEypcEEYwpspLAmNCMl4+lvTvhaNCrcLMpBWaT1z5Rt8boeIQ1KBfcZvP6KrQqq0KhBEIl0myUplFG+mrBeCk1R0VzJncCXsZF1Uq6bkIntJVjTiyqZ6Rlx7ZFemVTexenqaXdwlM7NGStZyyMbxXbzdDSucbCVaHZz16MU2ssEuoR1R5bb6PxST28+7QO5Szpi1btR4SHEHITmdTcIyBSPRKqtIWrUaOLKpUAPKuZJuOmY4KAE+owJL1ptnoIKB5XOQuKVEA5IITylOULA4JaYQuLUHIWQluCaoIQauQhITXhBCZAhRCdtUbEjaoemgqqHJzHrFue1yLelBqlBnNemByrSnMMpZKxpwqQhbWhLe4JBes7NtdtbT6pa2mryvM0HwtXT14Ci+oJ+tom0ypD5Cy26qbKWVypVpaLxMKxSMLM3SVfoGUBfY5Q9C0IXpxNIqvVNzpVmswlJbS6rXGscoU4JW0q05wCRUqrSVnlIQ956e6S5k8QnvqjkIRUHCuVnYo1WeCqPpla9RzfVVKjArmSLiznNKBWXhJeFSSXBLcnOS3BSqFLiiIUFCoW4KHJjgu2oCqVLWpzmKNqNgshRCMhQgHkpjHqHBQAsW62HWUtJKrB6Yx6AewSiqGAj0rQVGqAU5NMYqGolVHpT6kFJfUWe2ljQ01ZaLHrE071pMqwErRF5j7p4esKtrxMN90+hqyRcqbFStxrle071gU9V4q7pqyV9CR6Bj0bnBZ1GqrLqlk57Tl6FUrQqdTUeyXqa4Czqup8FtjiwzzW36kKs+rJlVn6k+HsgNcrWYsbltZdUQmoFUL1Acq0W134gS6lQJG5C4pkB7khyeQgIRstEFC4JjghcEbBRC5EQhhM4gBdCkLip2egoSiJQuQYCoUwu2nogaWWrguaEwMhRtv1CKZXEJ8qaYvKRaN0wIC7UUTEp7XjKhzw7OFGXtePp5+sClFpyvQ1dIyJASn0Glp7vqpmK+zEY+EdbUwEyronCSMLOqTKmw9pNe6tUaxhV2aebmyc1m3CVNaoVThaumrQQsiieoV6kbpURvUaye+tbKyqb1Za5VhPaOS+g1nSqzyrDlXqLpjkyJcVy4hc0Ktlpy5HtUEJbGggqV0IgE9jQCEJCaWIHNS2NEuCU5Wfhkov6dGz67UiEMK+NNKezSqblIuYWstrCibSK1P6dSKIU3OLnHWWKCNmlC0HUwohT3V41IaVF/Tq1ChLufSKTKYTWhc2wRshMwbVLGJoC5pARsaJcIUB8JtQgpTKclTauQ6jqQbcK61rXCFQdSjCtUqZyntNhWo0+xpEWPPRYTmAEyLr09a7SF53XCHKcjxLbT3K5p+zS7JiVV0lSTHC2dCYyZTxxl/Syys/CR2G4RBJHKh+lLV6BtWEms9rxGE7JUzKxjslWGFNZSEXQMaDgyjGaGV2mEDmqxsUELTsyuKuWKE1yEMR2HUstlEGJoap2pXI5iSWomMTNqbTYlcjmBfw1woyrcBSQp7rmCr8MBd8NOcFCm5qmAAxcV25C4qN7XJIklCXIS9LL0glzkJKguQlyoOLlEoXOQbkADCmNaoYEcq9lMRvwkPMpxKCEbGimnhW6FJJbTVmkYSMLnX8kx1eyXUKq1HqbQ0GPBiSqev0W8y3+FTFYhWdNqyVeP+oyn8ZrdEWuM+nmtzs+n3VFV++0JrnBrQArupPSPdvsdarGCkiol7ZuVYp0x1UqJr1YVSjqS188K9WpkiIVUUYI5RfcPH1WlkSISXI2C1lxalLorjsolSEwMXBg5RcoJigPUOepNQYAgIXPBUdl6cHJgckSpDkbGlkPUl6rh6IOUmYXoXOQEoHlUEuegc9A5yWXKTML0JcllyEuQBFygvSy5AXKiMc9DKWSolA2uYXISVBensDCawKu1ysNSgS5qhoKncolXAJzVRqC6uMaSmP04hFx2iZMWsULKpCs6rSnIWe7dOEtWK3K2NJVnlRUqEG5VGi4twTKs6Vm93euqQts1U2ATvj7cpzKbWiAEmvTDrcqLFSiGoBwUk1RKoahpYPWFWbVJKSnoKNQQicVQ0pgKwHoGjtyB7kJcgcUBxculLLl0oBm5QXJZQhykHSiBSw5ECqkAi5C5yFxSnPQBuKW5yEuSyVIMLkBcglQ4oAi5CXIZQoApXSllyHcgLrnIHLnFRKuwOY9WWVFVay6kOukF5l0bWqvTemh6cyKrFJWREQVSZUT2VUrlR1hpog2VTU9niJblXGvRg3TmRXFl19B3e6PEpnZWidunj8lqgCIUNO0QE7kJidV0o6rJrtLDf7CvfHgwUNSiKlnSI+UyolOx5ntPVcQqFEmVr9rdlOY4Xlpv6jP6e6qO0bg2YK11LGfayrNOvAlPpahpwQsOs16LTsfeAZGbT7LO41pMo9FKgqto6pIhwMqy4IMDlACOFxaiQFwhIRFQUBIcjlILkQejYG5JciLkLkBEIHJrUl5RoFyulcGqH2QEEoXuUFC5SEFchJUSqBZ7SFu6fG+F39fJgAR1JNx1ssahV3cLV0lDct+sc/fJoabVCDIuPr+yE9ogG7U+npY4VXWaWAYRMYLnkqa7tRzXSx42jiJJPMgjHqgqf8AISG7hEye7jyBJ9VSfT8OVn6jSucbCRN7I6Qu9bzP+RPJB+GNvNyXTyR+0LR0/a26Dibx4LyjKRAESnMY6UdIPJXttP2i1xgn6q4dVaYBHgvFaVrmmXPt5rfZ32BoNzg2keJWeWGmuPJtpl5ePDp+6V/cXF+wMJbYb9wyLO9lW0Or2zTeYIziY/lK1rjSLXA7mGSLXGLH76pa+Df1fr68MkusBNyRFrzKV2b2p8TvbobE7eQcEHrBHBusfXdq03sA5Mgjgd05KyKtUtOwO7pHFvH90+m4PJqvfDtGm8bC9pB7pEw4OsQOoPKqurtNQtBGwMGCD39xBEZwAvnze0HPc6Jsc2noJEIhqHAyJm1/Ec/UpzHX0ss9/HuHvpPcDvAb0i9iczfhc3VMa6GjcMk4gRaV4zTakz0C0tPWdwVciNvQEh93W8nCIyJKXW1TWP2l4lrd2yZcfABZLqzycwOQqD6jwQGzae9J3CeAeEdR2r1Wm1W9hcWlvv0twjpVBEF0nqvN6WtUoOMhxa9o+aXd8SeDa7ldbr/iB4lrDYMDhckCS7N/JT1V3p1WpULwCS1pNo7uOJyn6rXMY4MJ7zsAA54k8KlpN7gNwkj5jgXBgt4OFnazWUw8NL2tLNufQxbzanljCmWUbuorBrdxv4CJnpE5XUqm4SJ9fu/osfU1WRu3d6Dcd4EHylXezdR3GgQRcA+OSP4UXD+KnJ/V7fx9/dlBcsHtLtN1KoWtYO9DnONgDgERnj2V2n2iDAsd26LHLRJBHHql1q+8acpNR4GSB5qs/UFzW3I3ACwnI5hKp0i7N1Uw/qLyfxapvaYIcIKa+m2PmVJlMC3n9/VQKgYDucGthpJJteR+g90+kg8lQ7UsBguH1Uiuw/iCz61ag8F7KjTabnaQMXBuPZU9I9xa1xBgkwYiY81PSfB5L9brwlys59Z+wuE902mLWMx6Sk/3h3Q/6j/sl1q+8VNO4NOR9ZW3oNXBk4HosClXaL2Jx6q87VyCQGi2bm/5LaWOeyx6Qa4E2KvUgCLheQ0hc/Y5pLi0EESB5mwjhW6vbT6YhzDPB/AY6FFEehqaRn+ISn9nMnu7SIExZ0rzmgfV1Lt28yBfAA8gAn0u0abC7vuOzJAs89Gxnoj2PTS1HZ7A17tsbRIJNoiTePzXkKvam0ETOYIGBNpldX7cruDmOe4NdMthu2D+EW6WysOu4gkTIPn+XSVGWWSsccXpezdXvFzJi2PU/n7K/S7UYHNZvFrEgWHm6IjxXkdGRIIJ2jNwDA/P+UNYkP8A2x1lKZWw+sle37RYWO375DsHcJt1PhCjUa/4lFo3tMXsY5i/VeTNZxaGE/Nk4PW55T9P3Lgt8jj1SvJPpzGtj4QiTiJ9M2Wa/WscAxhg3ALhxkwfXlQztF4Ja4NA2mHCwFrHF/5WO9rt0nJVdu09J66vtcpV2tqAgQOcHOY64WhqRIDhuDYkPGLxAI9VgvYRFo97eS1aPaUU9m2Rg588jxS3r1Va37jXZQsI6AyORmwQdn9ova8B7Gta4w0ukGZiPF3thZh7Tc3aGNIAItuLuIMWxgwq2pqOc9hn5ZMSLXOAncp8KYvRu7Wpyd4LSCbWdMcAgxc26WSqvbsGWMaRHPzWuSYsOV5Ss7oSYJnm6Cm84mL8qLllT6x6xuufW+ZzWtgSA7bY3IIPNjcJep1AaQG4aSLkOcQMArBq1LgcCwjgj9El2pMzORk/d+ETK6O4yvT6fteB80AC5Bt1x1wvO6nVFxJJBgiLAQ0+SN7xBJebjEWVN1Eibg26j8spdt/ok0u0e0Hs7oOSCTa/stup28ym2mG02l076hdkkgDuREY6FeZYzNxif4UVTIAm4tfoql1NFrdei1ParKwfvYGOLDtIduBBFg4ZaYIWbT7QqMDdrjDCS0CIgiDfxSK9bcGAz3GNbB5iwPtHsgc8EXt6qblbTmMaju3KrW/ODLTBDQ0xNoOJFxhTo+16jiC5xdAILR3YmQH2i/8AHVYjnOLQ3gdTaOPzTdMAGk3mTIGdoEm6Jb/RZG23tarJcH7pBADwJb4i1jZZmrque6XO7xiYsC4fijgqtRrOdOMWtAHsie8nMT1HSOVO79p6E9zY+WD1GT1Pqjo9qPbTNOTtcZN7jizvQSqzKrmtm9iLdQiFDvNMSCRfiMlP1INJ3At+aJmBx0kn3Stn/wBj/b+U2lBcQ5oMYtAA5gBN+HT/AMT/AKlTswh0tBkSeJGfdFRrObMRnPHuqo0ruBbqLiOsC/0VllMRLjJPQ54E9PWFXeQ+lq3pdW9veDiIMxJyrWl1hJe97u8RIBwXTgDAsSslru9A2wI6gx1xEpu48G0iMXAOFflxiPDauafVPaTDtsgicWPgoq35sg1BBDTOciPlg8kZ6+qFzD+EtI8Sc+FkebH7R4cviXU/H6LPrUTIGJMfQrTpMdzFrCHC/ul1G3HJBnaCMxFyc2JsErzY30c4cp7VdJpbg3x+atPaOWybQY5k5+gR0mOa3aGmABexMX6G6JjjIgbpm8W8iAljy4QZcWak+i6d3E+qkh2R/N1fa9ziAGnr8pHGYPgu3vFywR4NcRgpXk46c4+SfxQpU35Jt+9rLTq6eQALniyrOrPztbcW7rvrMR9UPxqoI+UehMfXz+q0x5eOM8uHlo6ulPISKGlcTt2mPoUx+rqu/E08Da36mVWFSqPxW67QneXjv9GPDyT90u0NLNwBDgM9OPzQ6nSFhmLwq1P4wiCQGi3dkx0x+qt/1FQgy2bWkEG3MZKV5eOz2c4uWM1jCbdT7+aTUpkOLYv52+7rSpvMkuZ1wSLccfcoNQAXkxExGYEACxMypueGvVOYZ79xRqtm8EHGVAafvyV409wnc3yAJ+pKL4TTFxNxEESR06H6KPJivx5KYdtt4x9eOilrJk3/AG81YqUwLuIN4gAtnF8JzNgs6WjrxJHv7o74n0yZ/wAQt7o5PAvMrg/cZiOCR9+S1W02CB9frn1UtoUyN22+MTB6xyp8mJ+PJiVXmwOBYdMybeqhuMfZWvV7OaRJPXEASRPJxbqgb2cyLOPF49c+yPLj/R46y2tEHjojNchsDnPvP7LWb2c0DJPtInp9LIf7Wycu8cfsjy4DxZKNFwIBk8yLxJ8PvKW95mcCf/L/AHlajdC2IgmTiefRQdE13Dr+X/qnyYn4smZqGgju8ZH6odxBsSLRa5MC0rVbpWAQAfG9+k4+4RDTsm0zfgR0zCfkxHirLG4CCDiRkEkxcwk7B0d7j9lt/AZBbvI88JX9G3/P6NS8kHioX1D16pZ68wfyXLlm2AHn780RP37rlydJLRm5GMeiNjz583AyuXJUzad4nnKDWCHlgJge+DyoXIx/RVCpWcLA4uDzKtF9t0CRcWwY4Urld+In11CoXvE5jIsfdFVquGCRGI4suXKb+qn4g6l9u8ctHooquPU5+x5LlyA1az8iBgcX91LTAAgH5rm555XLlm0Fpg1wuxvPXp5pw0bNpdtEgW5jyBsuXJX9E/CKIgHHzcgY6Ywn1tIxu0hoz55N8rlyYZz65EQBd17DrjyVoNDm4Dbn5bT5rlyVKAp0wQ3yGLDJ4wh+GJxwuXJk6o3uzyJg+6OgO6DztcfVcuS+H9Jf87hwAiYIaHZN8/fgFy5MRNVggHn+FJsCebrlyk0B5k+iB9Q3++Fy5OFSatU7fvqFn1tU+9/sRC5cteOIzO0ryW55i1reidvd/kfZv7LlyL+ifj//2Q==',
  },
];

interface LabelProp {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

function DashboardPage() {
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [drawing, setDrawing] = useState(false);
  const [labels, setLabels] = useState<LabelProp[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(4);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (event: React.MouseEvent) => {
    let x = 0,
      y = 0;
    const { clientX, clientY } = event;
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      x = clientX - rect.left;
      y = clientY - rect.top;
    }

    setStartCoords({ x: x, y: y });
    setEndCoords({ x: x, y: y });
    setDrawing(true);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (drawing && imageRef.current) {
      const { clientX, clientY } = event;
      const rect = imageRef.current.getBoundingClientRect();
      let newEndCoords = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
      setEndCoords(newEndCoords);
    }
  };

  const handleMouseUp = (): void => {
    console.log('Label: ');
    console.log(`x1: ${startCoords.x} y1: ${Math.round(startCoords.y)}`);
    console.log(`x2: ${endCoords.x} y2: ${Math.round(endCoords.y)}`);
    setDrawing(false);
    const newLabel: LabelProp = {
      x1: startCoords.x,
      x2: endCoords.x,
      y1: startCoords.x,
      y2: endCoords.y,
    };
    setLabels(prev => [...prev, newLabel]);
  };

  const handleMouseLeave = () => {
    setDrawing(false);
  };

  const handleSliderImageClick = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
  };

  const handleLeftArrow = () => {
    if (selectedImageIndex > 0 && selectedImageIndex < 5)
      setSelectedImageIndex(selectedImageIndex - 1);
    if (selectedImageIndex === 0) setSelectedImageIndex(4);
  };

  const handleRightArrow = () => {
    if (selectedImageIndex >= 0 && selectedImageIndex < 5)
      setSelectedImageIndex(selectedImageIndex + 1);
    if (selectedImageIndex === 4) setSelectedImageIndex(0);
  };

  useEffect(() => {
    console.log(labels);
    //draw rectangle
  }, [labels]);

  return (
    <Wrapper>
      <div>
        If you see fire, label it! If you don't see the fire, skip the image.
      </div>
      <div className="image-grid">
        <span onClick={handleLeftArrow} className="arrow arrow-left">
          {'<'}
        </span>
        <div className="img-container">
          <img
            className="img"
            ref={imageRef}
            alt="smoke"
            src={sliderInfo[selectedImageIndex].img}
          />
          {drawing && (
            <div
              className="draw-rectangle"
              style={{
                left: Math.min(startCoords.x, endCoords.x),
                top: Math.min(startCoords.y, endCoords.y),
                width: Math.abs(endCoords.x - startCoords.x),
                height: Math.abs(endCoords.y - startCoords.y),
              }}
            />
          )}
          <div
            className="select-box"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
          />
        </div>
        <span onClick={handleRightArrow} className="arrow arrow-right">
          {'>'}
        </span>
        <div className="labels">
          {labels &&
            labels.map((item, index) => {
              return <Label label={item} />;
            })}
        </div>
      </div>
      <div className="slider-container">
        <div className="slider">
          {sliderInfo.map((item, index) => {
            return (
              <SliderItem
                handleImageClick={handleSliderImageClick}
                active={selectedImageIndex === index ? true : false}
                key={index}
                index={index}
                img={item.img}
              />
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
}

export default DashboardPage;
