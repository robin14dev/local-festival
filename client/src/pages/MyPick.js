import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import Pick from '../components/Pick';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > div {
    background-color: white;
    width: 100%;
    position: fixed;
    padding: 2rem 0 1rem 6rem;
    z-index: 1;
  }

  p {
    color: gray;
    word-break: keep-all;
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
  padding-top: 5rem;
  padding-bottom: 5rem;
  display: flex;
  width: 88%;
  flex-wrap: wrap;
  justify-content: flex-start;
  overflow-y: auto;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  &::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }

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

      <div>
        <h1>위시리스트</h1>
      </div>

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
