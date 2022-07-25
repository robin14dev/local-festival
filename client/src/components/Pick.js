import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import HeartButton from "./HeartButton";
import onErrorImage from "../assets/noimage.png"
import moment from "moment";
const Wrapper = styled.div`
    width: 18rem;
  height: 23em;
  padding: 0.2em;
  margin: 0.5rem;
  border: none;
  display: flex;
  flex-direction: column;
  /* box-shadow: 0.1rem 0.1rem 0.2rem  gray; */
  transition: transform 0.3s ease-out;
  /* font-family: "EarlyFontDiary"; */
  

  &:hover {
    .title>b {
      color:#6cf7a6; 
    }
    transform: scale(1.1);
    & > div:nth-child(2) {
      background-color: #1a6cb4;
      color: white;
    }

    svg {
      color: white;
    }
    
    
    
  }


  & > img {
    object-fit: fill;
    width: 100%;
    height: 70%;
    border-radius: 3.5px 3.5px 0 0;
    box-shadow: 1px 0  2px gray; 
  }
`;

const Description = styled.div`
  text-align: start;
  height: 7rem;
  padding: 1rem 1px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  color: black;
  box-shadow: 1px 1.5px 2px gray;
  background-color: #f2eeee;
  border-radius: 0 0 4px 4px;
  & > div {
    width: 80%;
    text-align: start;
    padding-left:0.5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    
    & > b{
      color: #073c6a;
      font-size :large;
     
    }
  }
`
const HeartDiv = styled.div`
display: flex;
justify-content: flex-end;
& > img {
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
  right: 0.8rem;
  bottom: 2.2rem;
}
`

const Pick = ({ item, deletePickTest }) => {
  const [like, setLike] = useState(true)

  let navigate = useNavigate();
  const { festivalId, title, imageUrl, startDate, endDate } = item;
  const onClickRemove = (event,id) => {
    event.stopPropagation();
    deletePickTest(id);

  };
  const onErrorImg = (e) => {
    e.target.src = onErrorImage
  }
 
  
  // useEffect(()=>{
  //   const isPicked = pickItems.some(ele => ele.festivalId === festivalId)
  //   setLike(isPicked)
   
  // })

  const onClickMoveDVP = () => {
    navigate(`/Detailviewpage/festivalId/${festivalId}`, { state: item });
  };
  return (
    <Wrapper onClick={onClickMoveDVP}>
        <img src={imageUrl || onErrorImage} alt={title}  onError={onErrorImg} />
      <Description>
       <div className="title">
          <b>{title}</b>
        </div>
        <div>
          <div >시작일:{moment(startDate, "YYYY.MM.DD").format("YYYY년 MM월 DD일")}</div>
          <div >종료일:{moment(endDate, "YYYY.MM.DD").format("YYYY년 MM월 DD일")}</div>
        </div>
     
        </Description>
        <HeartDiv>
        <HeartButton like={like}
            onClick={(event) => {
              onClickRemove(event, festivalId);
          
            }}
          >
          
          </HeartButton>
        </HeartDiv>
    </Wrapper>
  );
};

export default Pick;
