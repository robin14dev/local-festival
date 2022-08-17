import React from 'react';
import FestivalList from '../components/FestivalList';
import Hashtag from '../components/Hashtag';
import Search from '../components/Search';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 0 auto 5rem auto; // ㅇㅒ로 해결!!!
  width: 100vw;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: yellowgreen; */
  @media (max-width: 673px) {
    /* height: 55rem; */
  }
`;

const SearchAndTag = styled.div`
  width: 100vw;
  background-color: white;
  height: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 5rem;
  z-index: 1;
  padding: 1rem;
  /* border: 3px solid green; */
`;

const Mainpage = ({
  togglePick,
  onSearch,
  filteredData,
  pickItems,
  resetCondition,
}) => {
  return (
    <Wrapper>
      <SearchAndTag>
        <Search onSearch={onSearch} />
        <Hashtag onSearch={onSearch} />
      </SearchAndTag>
      <FestivalList
        togglePick={togglePick}
        festivals={filteredData}
        pickItems={pickItems}
      />
    </Wrapper>
  );
};

export default Mainpage;
