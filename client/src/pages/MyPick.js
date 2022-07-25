import React, {useState, useEffect} from "react";
import Picklist from "../components/Picklist";
import styled from "styled-components";
import axios from "axios";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 81rem;
  height: 60rem;
  margin: 5rem;
 
  @media (max-width: 1320px) {
    width: 95vw;
    
  }
  @media (max-width: 500px) {
    &>h1{
      font-size: 1.5rem;
      text-align: center;
    }
    
  }

`;

const MyPick = ({ authState, pickItems ,togglePick }) => {
  const {nickname} = authState

  return (
    <Wrapper>
      <h1> {nickname}님이 찜하신 축제들 입니다</h1>
      <Picklist
        togglePick={togglePick}
        pickItems={pickItems}
      />
    </Wrapper>
  );
};

export default MyPick;
