import React from "react";
import Navigationbar from "./Navigationbar";
import  Search  from "./Search";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 5em;
  width: 100%;
  align-items: center;
  border-bottom : 1px solid lightgray;
  box-shadow: 0 0.5px 1px lightgray;
  margin-bottom: 2rem;
    position: relative;

  & > h1{
  font-size: 2rem;
  cursor: pointer;
  font-style: italic;
  font-family: 'HS-Regular';
  color: #1564a9;
  margin: 0 3rem;
  }

  

`;




const Header = ({ authState, loginHandler }) => {

  

  const onClickReload = ()=>{
    window.location.replace("/")
  }
  return (
    <Wrapper>
      <h1 onClick={onClickReload}>LoCo</h1>
      <Search />
      <Navigationbar loginHandler={loginHandler} authState={authState} />
    </Wrapper>
  );
};

export default Header;
