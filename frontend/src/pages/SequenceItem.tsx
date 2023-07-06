import React, { useEffect, useCallback, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  getSequenceById,
  getSequenceImagesByNameAndFrame,
} from '../networking/sequenceControllerNetwork';
import { useAuth } from '../context/auth';
import { authContextProps } from '../@interfaces/authContext';
import { Context } from '../context/context';
import { ContextProps } from '../@interfaces/interfaces';
import Slider from '../components/Slider';
import styled from 'styled-components';
import { adjustToScale } from '../label_processing/label_processing';

const Wrapper = styled.div`
  margin: 2em;
  display: flex;
  justify-content: center;
  align-items: center;

  .item__info {
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    margin: 1em;
  }
`;

function SequenceItem() {
  const { id } = useParams();
  const { token } = useAuth() as authContextProps;
  const {
    setCurrentImageIndex,
    setSelections,
    setFullScreenWidth,
    fullImageRatioToOg,
  } = useContext(Context) as ContextProps;
  const [date, setDate] = useState('');
  const [sequenceData, setSequenceData] = useState<{
    sequenceName: string;

    images: { imageName: string; image: string }[];
  }>({
    sequenceName: 'loading',
    images: [],
  });

  const fetchSequence = useCallback(
    async (id: string) => {
      const response = await getSequenceById(token, +id);

      const frame_00 = response.results[0].frame_00.split('-')[0];
      const sequence_name = response.results[0].sequence_name;
      const imagesResponse = await getSequenceImagesByNameAndFrame(
        token,
        sequence_name,
        frame_00
      );
      const time = new Date(imagesResponse.data.selection.reviewed_at);
      const dateTimeObj = new Date(time);
      const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const formattedDateTime = formatter.format(dateTimeObj);

      setDate(formattedDateTime);
      const base64Mod = imagesResponse.data.images.map(
        (item: { imageName: string; image: string }, i: number) => {
          const numString = i.toString();
          const padding = '0'.repeat(Math.max(0, 2 - numString.length));

          return {
            imageName: `${item.imageName}--frame${padding + numString}.jpg`,
            image: 'data:image/jpeg;base64,' + item.image,
          };
        }
      );
      const selections = response.results[0].selections;
      setSelections(adjustToScale(selections, 1 / fullImageRatioToOg));
      setSequenceData({
        sequenceName: imagesResponse.data.sequenceName,
        images: base64Mod,
      });
    },
    [token, setSelections]
  );

  useEffect(() => {
    setSelections([]);
    setCurrentImageIndex(0);

    if (id) {
      fetchSequence(id);
    }
  }, [
    token,
    id,
    setFullScreenWidth,
    fetchSequence,
    setCurrentImageIndex,
    setSelections,
  ]);

  return (
    <Wrapper>
      <div className="item__info">
        <span> Sequence id : {id}</span>
        <span>Marked: {date}</span>
      </div>

      <Slider sliderInfo={sequenceData.images} />
    </Wrapper>
  );
}

export default SequenceItem;
