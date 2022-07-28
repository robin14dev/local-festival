import React, {useEffect, useRef, useState} from "react";
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

  const [dataOffset, setDataOffset] = useState(0)


  // console.log(pageEnd);
  useEffect(()=>{
    console.log('hi : 2');
  console.log(pageEnd.current);
}, [])

const pageEnd = useRef();

  

  //    const observer = new IntersectionObserver((entries)=>{
  //   console.log(entries);
  //    })
  // observer.observe(pageEnd.current)

  

 
  if (!festivals) {
    console.log('no festival : 1');
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
          <div ref={pageEnd}>scroll more</div>
      </Wrapper>      
       

    );
  }
};

export default FestivalList;
