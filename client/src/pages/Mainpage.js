import React from "react";
import FestivalList from "../components/FestivalList";
import Hashtag from "../components/Hashtag";
import Search from "../components/Search";
import styled from "styled-components";
import resetImg from "../assets/reset.png"
import { IoSyncCircleSharp } from "react-icons/io5";
const Wrapper = styled.div`
  /* width: 81rem; */
  width : 100vw;
  height: 44rem;
  /* background-color: yellowgreen; */
  display: flex;
  flex-direction: column;
  /* justify-content: space-evenly; */
  align-items: center;

  
  @media (max-width: 673px) {
  height: 55rem;
 }
`;

const FilteredInfo = styled.div`
width: 93%;
height: 10%;
/* align-self: flex-start; */
margin-top: 1rem;
font-size: 1.7rem;
/* background-color: yellow; */
line-height: 3;
position: relative;
/* left: 3.5rem; */
bottom: 1rem;
display: flex;
justify-content: space-between;
font-family: 'SuseongDotum';


&>svg{
  width: 2.8rem;
  height: 2.8rem;
  position: relative;
  top: 0.8rem;
  &:hover{
     transition: all 1s ease-in-out;
    transform: rotate(-45deg);

  }
  &:active   {
    
  transform: rotate(180deg);
  transition: 0.1s;   


  }
}
@media (max-width: 1210px) {
  width: 69%;
 }
@media (max-width: 1010px) {
  width: 45%;
 }
@media (max-width: 673px) {
  width: 35%;
  /* height: 50rem; */
 }
 
`
const Mainpage = ({ infiniteScroll,authState,togglePick, onSearch, filteredData, pickItems, resetCondition }) => {
  

  return (
    <Wrapper>
      <FestivalList infiniteScroll={infiniteScroll}  authState={authState} togglePick={togglePick} festivals={filteredData} pickItems={pickItems} />
      <Hashtag onSearch={onSearch}/>
    </Wrapper>
  );
};

export default Mainpage;
