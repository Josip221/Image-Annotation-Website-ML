import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1em;

  .label-box {
    height: 300px;
    width: 500px;
    background-color: ;
  }
`;

function DashboardPage() {
  return (
    <Wrapper>
      <div>
        "If you see fire, label it! If you don't see the fire, skip the image.
      </div>
      <div className="label-box"></div>
    </Wrapper>
  );
}

export default DashboardPage;
