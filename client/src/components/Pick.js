import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import HeartButton from './HeartButton';
import onErrorImage from '../assets/noimage.png';
import moment from 'moment';
import HeartImg from '../assets/heart.png';
import EmptyHeartImg from '../assets/empty-heart.png';
const Wrapper = styled.div`
  width: 272px;
  height: auto;
  display: flex;
  flex-direction: column;
  margin: 1rem;
  cursor: pointer;
  & > img {
    width: 100%;
    height: 270px;
    border-radius: 10px;
    object-fit: fill;
  }
  section {
    display: flex;
    justify-content: space-between;
    padding: 0 0.5rem;

    h1 {
      font-weight: 600;
      font-size: 14px;
      line-height: 17px;
      margin: 0.4rem 0 0.18rem 0;
    }

    li {
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      color: #797979;
    }

    h1,
    li {
      white-space: nowrap;
      overflow: hidden;
      width: 11rem;
      text-overflow: ellipsis;
    }
  }

  button > img {
    height: 1.5rem;
    width: auto;
  }

  transition: transform 0.3s ease-out;

  &:hover {
    transform: scale(1.03);
  }

  @media (max-width: 485px) {
    margin: 0.5rem 0;
    width: 357px;
    height: 409px;

    &:hover {
      transform: none;
    }

    & > img {
      height: 340px;
    }
    section {
      h1,
      li {
        width: 100%;
      }
    }
  }
`;

const Pick = ({ festival, togglePick }) => {
  const [like, setLike] = useState(true);

  let navigate = useNavigate();
  const { festivalId, title, imageUrl, startDate, endDate, location } =
    festival;
  const onClickRemove = (event, festival) => {
    event.stopPropagation();
    togglePick(festival);
  };
  const onErrorImg = (e) => {
    e.target.src = onErrorImage;
  };

  const onClickMoveDVP = () => {
    navigate(`/Detail/${festivalId}`);
  };
  return (
    <Wrapper onClick={onClickMoveDVP}>
      <img src={imageUrl || onErrorImage} alt={title} onError={onErrorImg} />
      <section>
        <div>
          <h1>{title}</h1>
          <ul>
            <li>{location}</li>
            <li>
              {moment(startDate, 'YYYY.MM.DD').format('YYYY.MM.DD')} ~{' '}
              {moment(endDate, 'YYYY.MM.DD').format('YYYY.MM.DD')}
            </li>
          </ul>
        </div>
        <button
          onClick={(e) => {
            onClickRemove(e, festival);
          }}
        >
          <img alt="heart" src={like ? HeartImg : EmptyHeartImg} />
        </button>
      </section>
    </Wrapper>
  );
};

export default Pick;
