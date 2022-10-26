import React, { useState } from 'react';
import styled from 'styled-components';
import { IoSearchCircleSharp } from 'react-icons/io5';
import SearchImage from '../assets/search-mobile.png';

const Wrapper = styled.div`
  width: 476px;

  background: white;
  margin-top: 0.5rem;
  height: 43px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 0 0.1rem 0.3rem 0.01rem lightgray;

  border-radius: 0.7rem;
  position: fixed;
  top: 5rem;

  input {
    width: 100%;
    height: 60%;
    border: none;
    font-size: 1rem;
    /* font-family: 'NanumSquareRound'; */
    /* font-weight: bold; */
    border-radius: 0.2rem;
    padding-left: 0.5rem;
    margin-left: 0.5rem;
    background: white;
  }
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background-image: none;
    font-size: large;
    font-weight: bold;
    border-radius: 0.2rem;

    img {
      height: 50%;
      width: 50%;
    }
  }

  @media (max-width: 475px) {
    width: 320px;
    border-radius: 9px;
    height: 43px;
    box-shadow: none;

    input::placeholder {
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
      /* identical to box height */

      color: #978d8d;
    }
  }
`;

const Search = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  /*
  검색 기능 로직

  클라이언트에서 검색어와 offset이 0인  api를 서버로 보낸다
//  서버에서 해당 검색어가 포함된 축제들을 db에서 조회해서 한번에 다 받아온다
  무한스크롤이기 때문에 


  기존 무한스크롤 로직

  이미 전체개수가 확정


  검색 무한스크롤 로직

  mysql에서 like
  전체 개수가 일단 확정되야함

  기존에는 현재 진행중인 축제들만 불러오는걸로 했는데 일단 진행중인 것들만 

  검색버튼 눌렀을 때 검색어가 url에 들어가 있어야함
  url query에 변화가 생기면 
https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%ED%82%A5%EB%B3%B4%EB%93%9C

localhost:3000/search?query=뭐시기


http://localhost:3000/Detail/141105
http://localhost:3000/MyPick
http://localhost:3000/AccountSetting
  
  
  */

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
        placeholder="축제를 검색해 주세요"
      />
      <button onClick={onClickSearch}>
        <img src={SearchImage} alt="search"></img>
      </button>
    </Wrapper>
  );
};

export default Search;
