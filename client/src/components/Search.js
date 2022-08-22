import React, { useState } from 'react';
import styled from 'styled-components';
import { IoSearchCircleSharp } from 'react-icons/io5';

const Background = styled.div`
  width: 100vw;
  background: linear-gradient(to bottom, blue 50%, white 50%);
  display: flex;
  justify-content: center;
  /* height: rem; */
  position: fixed;
  top: 4rem;
  z-index: 0;
`;
const Wrapper = styled.div`
  background-color: white;
  margin: 0.5rem 0;
  height: 3rem;
  width: 40%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 0 0.1rem 0.3rem 0.01rem lightgray;

  border-radius: 0.7rem;
  background: white;
  position: fixed;
  top: 5rem;

  & > input {
    width: 80%;
    height: 60%;
    border: none;
    font-size: 1rem;
    font-family: 'NanumSquareRound';
    font-weight: bold;
    border-radius: 0.2rem;
    padding-left: 0.5rem;
    margin-left: 0.5rem;
    background: white;
  }
  & > button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background: none;
    font-size: large;
    font-weight: bold;
    border-radius: 0.2rem;
    & > * {
      color: var(--primaryBlue);
    }
  }

  @media (max-width: 540px) {
    width: 30%;
    height: 8%;
  }
`;

const Search = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const onClickSearch = () => {
    onSearch(searchText);
  };
  const onChangeHandler = (e) => {
    console.log(e.target.value);
    setSearchText(e.target.value);
  };
  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchText);
    }
  };
  return (
    <Wrapper>
      <input
        onKeyPress={onKeyPress}
        onChange={onChangeHandler}
        placeholder="축제를 검색해주세요!"
      />
      <button onClick={onClickSearch}>
        <IoSearchCircleSharp size={40} />
      </button>
    </Wrapper>
  );
};

export default Search;
