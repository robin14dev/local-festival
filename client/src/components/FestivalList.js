import React, { useEffect, useRef } from 'react';
import Festival from './Festival';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 76rem;
  margin-top: 12rem;
  /* background-color: #ffff0062; */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* align-items: center; */

  @media (max-width: 1210px) {
    width: 90vw;
  }
`;

const FestivalList = ({ festivals, pickItems, togglePick }) => {
  useEffect(() => {
    console.log('hi : 2');
    console.log(pageEnd.current);
  }, []);

  const pageEnd = useRef();

  if (!festivals) {
    console.log('no festival : 1');
    return (
      <div>
        <h1>축제 정보가 업스무니다</h1>
      </div>
    );
  } else {
    return (
      <Wrapper>
        {festivals.map((festival) => (
          <Festival
            togglePick={togglePick}
            key={festival.festivalId}
            festival={festival}
            pickItems={pickItems}
          />
        ))}
        <div ref={pageEnd}>scroll more</div>
      </Wrapper>
    );
  }
};

export default FestivalList;
