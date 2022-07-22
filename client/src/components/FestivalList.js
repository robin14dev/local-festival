import React, {useRef} from "react";
import Festival from "./Festival";
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.div`
  width: 100%;
  height: 60%;
  padding: 0;
  /* background-color : aqua; */
  
  /* padding: 0.5em; */
  border: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow-y: auto;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */

  /*&::-webkit-scrollbar {
    display: block; /* for Chrome, Safari, and Opera 
  }
  */

  /* @media (max-width: 1000px) {
    width: 90vw;
    
  } */
  @media (max-width: 1210px) {
    width: 90vw;
    
  }

  
`;

const FestivalList = ({infiniteScroll,authState, festivals, pickItems,togglePick }) => {

  const scrollHi = async (e) => {
    //!요청을 중복해서 보내면 안됨 왔다갔다 하면서 
    let check = 10;
    console.log(` 스크롤 내 높이 ${e.target.clientHeight}, ${e.target.scrollTop}, 전체높이 : ${e.target.scrollHeight}`);
    if(e.target.scrollTop % 200 === 0) { // 200, 400, 600, 800 
    const divided = e.target.scrollTop / 200 // 1,2,3,4
    const offset = divided * 10
      // 기본 10개, offset 요청은 10,20,30,40,
      console.log('요청-------------------', e.target.scrollTop);
      console.log(offset);
      // 기존에 불러왔던 정보는 상태변화 해줘야겠네?? 
      //일단 스크롤 반응해서 불러오는지 확인
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/festivals`,
          {params: {offset : offset ,limit: 10}}, 
        );

        infiniteScroll(response.data)

      } catch (error) {
        
      }
     
    }
  }

 // console.log(festivals);
  if (!festivals) {
    return (
      <div>
        <h1>축제 정보가 업스무니다</h1>
      </div>
    );
  } else {
    return (
      <Wrapper  onScroll={scrollHi}>
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
