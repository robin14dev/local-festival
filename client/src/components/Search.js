import React, { useState } from "react";
import styled from "styled-components";
import { IoSearchCircleSharp } from "react-icons/io5";
const Wrapper = styled.div`
  background-color: white;
  margin: 0.5rem 0;
  /* margin-right: 8rem; */
  height: 60%;
  width: 23%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 0.01rem 0.01rem 0.2rem 0.01rem  gray;
  border-radius: 1.8rem;
  & > * {
    margin: 1rem 0;
  }
  & > input {
    width: 80%;
    height: 60%;
    border: none;
    font-size: 1rem;
    /* font-weight: bold; */
    border-radius: 0.2rem;
    padding-left: 0.5rem;
    margin-left: 0.5rem;
    background: none;
    
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
        color: #2f76d3;
      }

    
  }
    &  svg:active {
  /* box-shadow: 1px 1px 0 rgb(0,0,0,0.5); */
  background: none;
  color: #05c299;

  /* position: relative;
  top:3px; */
  transition: 0.05s;
    }

    @media (max-width: 540px) {
  width: 30%;
  height: 8%;
 }
  
`;

const Search = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const onClickSearch = () => {
    onSearch(searchText);
  };
  const onChangeHandler = (e) => {
    console.log(e.target.value);
    setSearchText(e.target.value);
  };
  const onKeyPress = (e) => {

    if(e.key === 'Enter') {
   
      onSearch(searchText);
   
    }
   
   }
  return (
    <Wrapper>
      <input onKeyPress={onKeyPress} onChange={onChangeHandler} placeholder="축제를 검색해주세요!" />
      <button onClick={onClickSearch}><IoSearchCircleSharp  size={40}/></button>
    </Wrapper>
  );
};

export default Search;
