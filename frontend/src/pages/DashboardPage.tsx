import React from 'react';
import styled from 'styled-components';
import ImageLabeler from '../components/ImageLabeler';

const Wrapper = styled.div``;

const url =
  'https://ec.europa.eu/research-and-innovation/sites/default/files/hm/field/image/wildfire-1826204_1280.jpg';

function DashboardPage() {
  return (
    <Wrapper>
      <ImageLabeler imageUrl={url} />
    </Wrapper>
  );
}

export default DashboardPage;
