import React from 'react';
import FestivalList from '../components/FestivalList';
import Hashtag from '../components/Hashtag';
import Search from '../components/Search';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 0 auto 5rem auto; // ㅇㅒ로 해결!!!
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 475px) {
    margin: 0;
  }
`;

const SearchAndTag = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 5rem;
  z-index: 1;
  /* padding: 1rem; */
  /* border: 3px solid green; */
  background-color: white;

  @media (max-width: 475px) {
    background-color: ${(props) => props.theme.usingColor.mainColor};
    width: 100%;
    padding: 0;
    /* display: block; */
  }
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
