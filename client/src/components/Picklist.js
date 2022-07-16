import React from "react";
import Pick from "./Pick";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
    /* border: 3px solid yellowgreen; */
  width: 100%;
  height: 100%;
  
  flex-wrap: wrap;
  justify-content: flex-start;
  overflow-y: auto;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  &::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }

  @media (max-width: 640px) {
    justify-content: center;
  }
`;
const Picklist = ({ festivalData, pickItems, togglePick }) => {
  if (festivalData === null) {
    return <div>데이터를 받아오는 중</div>;
  } else {
   // console.log(pickItems);
    const renderedItems = festivalData.filter(
      (ele) => pickItems.map((el) => el.festivalId).indexOf(ele.festivalId) > -1
    );
    console.log('renderedItems',renderedItems);
    return (
      <>
        {pickItems.length === 0 ? (
          <h1 style={{position:"absolute", left:"35rem",top:"25rem"}}>현재 찜하신 축제가 없습니다</h1>
        ) : (
          <Wrapper>
            {renderedItems.map((ele) => {
              return <Pick key={ele.festivalId} item={ele} pickItems={pickItems} togglePick={togglePick} />;
            })}
          </Wrapper>
        )}
      </>
    );
  }
};

export default Picklist;
