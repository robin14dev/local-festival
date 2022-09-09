import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import HeartButton from './HeartButton';
import onErrorImage from '../assets/noimage.png';
import moment from 'moment';

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
  border-radius: 0.5rem;
  overflow: hidden;
  &:hover {
    background-color: ${(props) => props.theme.color.primaryBlue};
    .title > b {
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
    padding-left: 0.5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    & > b {
      color: #073c6a;
      font-size: large;
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
`;

const Pick = ({ festival, togglePick }) => {
  const [like, setLike] = useState(true);

  let navigate = useNavigate();
  const { festivalId, title, imageUrl, startDate, endDate } = festival;
  const onClickRemove = (event, festival) => {
    event.stopPropagation();
    togglePick(festival);
  };
  const onErrorImg = (e) => {
    e.target.src = onErrorImage;
  };

  // useEffect(()=>{
  //   const isPicked = pickItems.some(ele => ele.festivalId === festivalId)
  //   setLike(isPicked)

  // })

  const onClickMoveDVP = () => {
    navigate(`/Detailviewpage/festivalId/${festivalId}`, { state: festival });
  };
  return (
    <Wrapper onClick={onClickMoveDVP}>
      <img src={imageUrl || onErrorImage} alt={title} onError={onErrorImg} />
      <Description>
        <div className="title">
          <b>{title}</b>
        </div>
        <div>
          <div>
            시작일:{moment(startDate, 'YYYY.MM.DD').format('YYYY년 MM월 DD일')}
          </div>
          <div>
            종료일:{moment(endDate, 'YYYY.MM.DD').format('YYYY년 MM월 DD일')}
          </div>
        </div>
      </Description>
      <HeartDiv>
        <HeartButton
          like={like}
          onClick={(event) => {
            onClickRemove(event, festival);
          }}
        ></HeartButton>
      </HeartDiv>
    </Wrapper>
  );
};

export default Pick;
