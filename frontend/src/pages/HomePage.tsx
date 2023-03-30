import React from 'react';
import styled from 'styled-components';
import Button from '../components/Button';

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
        <p>LOREM IPSUM</p>
      </div>
      <div className="homepage-box">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, WHAT WE DO
      </div>
      <div className="homepage-box">WHO WE ARE</div>
    </Wrapper>
  );
}

export default HomePage;
