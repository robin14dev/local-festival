import React, {useEffect, useState} from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import onErrorImage from "../assets/noimage.png"
import Moveloginpick from "./Moveloginpick"
import HeartButton from "./HeartButton";

const Wrapper = styled.div`
  width: 18rem;
  height: 22rem;
  margin: 0.5rem;
  border: none;
  display: flex;
  flex-direction: column;
  background-color: #f6f5f5bb; 
  transition: transform 0.3s ease-out;
  box-shadow: 1px 1.5px 2px gray;
  border-radius:  0.5rem;
  overflow: hidden;
  &:hover {
    background-color: #4968bd;
    .title>b {
      color: white;
    }
    transform: scale(1.03);
    & > div:nth-child(2) {
      color: white;
    }
  }

  & > img {
    object-fit: fill;
    width: 100%;
    height: 15rem;
    /* border-radius: 3.5px 3.5px 0 0; */
    /* box-shadow: 1px 0  2px gray;  */
  }
`;

const Description = styled.div`
  height: 5rem;
  padding: 1rem 1px 0 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* box-shadow: 1px 1.5px 2px gray;
  background-color: #f2eeee; */
  
  & > div {
    width: 80%;
    padding-left:0.5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    
    & > b{
      color: #073c6a;
      font-size :large;
     
    }

    
  }

  

  
`;

const HeartDiv = styled.div`
display: flex;
justify-content: flex-end;
padding-right: 0.5rem;
/* background-color: red; */
& > img {
  width: 1.5rem;
  height: 1.5rem;
 
}
`



const Festival = ({ authState, festival, togglePick, pickItems }) => {
  const {festivalId, title, imageUrl, startDate, endDate} = festival
  const [like, setLike] = useState(false)
  let navigate = useNavigate();

  const onErrorImg = (e) => {
    e.target.src = onErrorImage;
  }
 
  const onClickMoveDVP = (id) => {
    //console.log(id);
    navigate(`/Detailviewpage/festivalId/${id}`, { state: festival });
  };
  const toggleLike =  (event) => {
    // event.stopPropagation();
    setLike(!like)
  }

  useEffect(()=>{
    const isPicked = pickItems.some(ele => ele.festivalId === festivalId)
    setLike(isPicked)
    //console.log('hey');
  })

  const onClickPick = (event, id) => {
    event.stopPropagation();
    console.log("pick_id!!!!!!!!!!", id);
    togglePick(festival);
    toggleLike()
  };

  const onClickGuest = (e) => {
    e.stopPropagation();
    alert('guest!!!')
  }
  

  return (
    <Wrapper key={festivalId} onClick={()=>{onClickMoveDVP(festivalId)}}>
     
      <img
        src={imageUrl || onErrorImage}
         alt={`${title} : ???????????? ???????????? ????????????`}
        onError={(e)=> onErrorImg(e)}
      />

      <Description>
        <div className="title">
          <b>{title}</b>
        </div>
        <div>
          <div >?????????:{moment(startDate, "YYYY.MM.DD").format("YYYY??? MM??? DD???")}</div>
          <div >?????????:{moment(endDate, "YYYY.MM.DD").format("YYYY??? MM??? DD???")}</div>
        </div>
        
        </Description>
        <HeartDiv>
          
        {authState.loginStatus ? <HeartButton like={like}
            onClick={(e) => {
              onClickPick(e, festival);
          
            }}
          >
          
          </HeartButton> : <Moveloginpick></Moveloginpick>}
        </HeartDiv>
        
      
        
      
      
    </Wrapper>
  );
};

export default Festival;
