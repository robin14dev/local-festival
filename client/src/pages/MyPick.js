import React from 'react';
import Picklist from '../components/Picklist';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

const Wrapper = styled.div`
  width: 76rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 8rem 5rem;

  @media (max-width: 1320px) {
    width: 95vw;
  }
  @media (max-width: 500px) {
    & > h1 {
      font-size: 1.5rem;
      text-align: center;
    }
  }
`;

const MyPick = ({ authState, pickItems, togglePick }) => {
  const { nickname } = authState;

  return (
    <Wrapper>
      <Helmet>
        <title>나의 위시리스트 - LOCO</title>
      </Helmet>
      <h1> {nickname}님이 찜하신 축제들 입니다</h1>
      <Picklist togglePick={togglePick} pickItems={pickItems} />
    </Wrapper>
  );
};

export default MyPick;
