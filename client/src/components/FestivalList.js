import React, {useEffect, useRef} from "react";
import Festival from "./Festival";
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.div`
  width: 76rem;
  margin-top: 12rem;
  /* background-color: #ffff0062; */
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
 

  /* @media (max-width: 1000px) {
    width: 90vw;
    
  } */
  @media (max-width: 1210px) {
    width: 90vw;
    
  }

  
`;

const FestivalList = ({authState, festivals, pickItems,togglePick }) => {

 // console.log(festivals);
  if (!festivals) {
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
          authState={authState}
            togglePick={togglePick}
            key={festival.festivalId}
            festival={festival}
            pickItems={pickItems}
          />
        ))}
      </Wrapper>      
       

    );
  }
};

export default FestivalList;
