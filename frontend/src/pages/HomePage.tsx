import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .homepage-box {
    background-color: ${props => props.theme.colors.second};
    height: 200px;
    margin: 2em 0;
    text-align: center;
    overflow: hidden;
    padding: 0 1em;
    width: 500px;
  }
`;

function HomePage() {
  return (
    <Wrapper>
      <div className="homepage-box">
        <p>WHO WE ARE</p>
      </div>
      <div className="homepage-box">WHAT WE DO</div>
      <div className="homepage-box">CAMERA LOCATIONS</div>
      <div className="homepage-box">CONTACT</div>
    </Wrapper>
  );
}

export default HomePage;
