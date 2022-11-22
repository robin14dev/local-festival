import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import Pick from '../components/Pick';

const Wrapper = styled.div`
  margin: 0 auto 5rem auto;
  padding-top: 10rem;
  width: 88%;
  display: flex;
  flex-direction: column;

  p {
    color: gray;
    word-break: keep-all;
    margin-top: 5rem;
    font-size: 2rem;
  }

  @media (max-width: 485px) {
    margin-bottom: 3.438rem;
    & > div {
      padding-left: 1rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
`;
const PickList = styled.section`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    justify-content: center;
    margin: 0;
  }

  @media (max-width: 485px) {
    padding-bottom: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;
  }
`;
const MyPick = ({ authState, pickItems, togglePick }) => {
  console.log('mypick!!');
  return (
    <Wrapper>
      <Helmet>
        <title>나의 위시리스트 - LOCO</title>
      </Helmet>

      <h1>위시리스트</h1>

      {pickItems.length === 0 ? (
        <p>
          마음에 드는 축제를 위시리스트에 저장하려면 하트 아이콘을 눌러주세요
        </p>
      ) : (
        <PickList>
          {pickItems.map((pick) => {
            return (
              <Pick
                key={pick.festivalId}
                festival={pick}
                pickItems={pickItems}
                togglePick={togglePick}
              />
            );
          })}
        </PickList>
      )}
    </Wrapper>
  );
};

export default MyPick;
