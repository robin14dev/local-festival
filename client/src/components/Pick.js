import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import HeartButton from "./HeartButton";

const Wrapper = styled.div`
  width: 22%;
  height: 25em;
  padding: 0.2em;
  margin: 0.5rem;
  border: none;
  /* background-color: #ff8a3d; */
  display: flex;
  flex-direction: column;
  box-shadow: inset;
  transition: transform 0.3s ease-out;
  /* z-index: 999000; */
  

  &:hover {
    transform: scale(1.1);
    & > div:nth-child(2) {
      background-color: #f8826b;
    }
  }

  

  & > img {
    object-fit: fill;
    width: 100%;
    height: 70%;
    border-radius: 3.5px 3.5px 0 0;
  }
`;

const Description = styled.div`
  text-align: start;
  height: 7rem;
  padding: 0.2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border-top: 0.3em solid; */
  color: white;
  background-color: #d2ad81;
  border-radius: 0 0 4px 4px;
  & > div {
    width: 80%;
    text-align: center;
  }
`;

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

const Pick = ({ item, removePick, pickItems }) => {
  const [like, setLike] = useState(false)

  let navigate = useNavigate();
  const { id, title, image, start_date, end_date } = item;
  const onClickRemove = (event,id) => {
    event.stopPropagation();
    removePick(id);

  };
  
  useEffect(()=>{
    const isPicked = pickItems.some(ele => ele.festival_id === id)
    setLike(isPicked)
    console.log('hey');
  })

  const onClickMoveDVP = () => {
    navigate(`/Detailviewpage/festival_id/${id}`, { state: item });
  };
  return (
    <Wrapper onClick={onClickMoveDVP}>
        <img src={image} alt={title} />
      <Description>
        
        <div><b>{title}</b></div>
        <div>{start_date}~{end_date}</div>
        <div>pickdate</div>
     
        </Description>
        <HeartDiv>
        <HeartButton like={like}
            onClick={(event) => {
              onClickRemove(event, id);
          
            }}
          >
          
          </HeartButton>
        </HeartDiv>
    </Wrapper>
  );
};

export default Pick;
