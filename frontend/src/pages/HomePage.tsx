import React from 'react';
import styled from 'styled-components';
import Button from '../components/Button';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .box {
    height: 200px;
    margin: 2em 0;
    text-align: center;
    overflow: hidden;
    border: solid 2px firebrick;
    border-radius: 2em;
    padding: 0 1em;
    width: 100%;
  }
`;

function HomePage() {
  return (
    <Wrapper>
      <div className="box">
        <p>LOREM IPSUM</p>
        <Button>Sign up</Button>
      </div>
      <div className="box">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, WHAT WE DO
      </div>
      <div className="box">WHO WE ARE</div>
    </Wrapper>
  );
}

export default HomePage;
