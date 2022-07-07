import React from "react";
import Picklist from "../components/Picklist";
import styled from "styled-components";
import EditProfile from "../components/EditProfile";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 81rem;
  height: 60rem;
 
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

const Nav = styled.div`
  /* border: 1px solid black; */
  align-self: flex-end;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  
  /* justify-content: flex-end; */

  height: 4rem;
  width: 30rem;
  margin-top: 1rem;
`;

const Mypage = ({ authState,handleAuthState,festivalData, pickItems, togglePick }) => {
  const {nickname} = authState

  
  return (
    <Wrapper>
      <Nav>
        <EditProfile authState={authState} handleAuthState={handleAuthState} />
      </Nav>
      <h1> {nickname}님이 찜하신 축제들 입니다</h1>
      <Picklist
        togglePick={togglePick}
        festivalData={festivalData}
        pickItems={pickItems}
      />
    </Wrapper>
  );
};

export default Mypage;
