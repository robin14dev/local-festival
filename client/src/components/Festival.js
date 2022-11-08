import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import onErrorImage from '../assets/noimage.png';
import HeartButton from './HeartButton';
import { UserContext } from '../contexts/userContext';
import { ModalContext } from '../contexts/modalContext';
import HeartImg from '../assets/heart.png';
import EmptyHeartImg from '../assets/empty-heart.png';
import '../styles/common.scss';
const Wrapper = styled.div`
  width: ${(props) => props.theme.calcRem(272)};
  width: ${({ theme }) => theme.calcRem(272)}; /* 구조분해 */
  display: flex;
  flex-direction: column;
  margin: 1rem;
  cursor: pointer;
  & > img {
    width: 100%;
    height: ${({ theme }) => theme.calcRem(270)};
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
    width: ${({ theme }) => theme.calcRem(357)};
    height: ${({ theme }) => theme.calcRem(409)};

    &:hover {
      transform: none;
    }

    & > img {
      height: ${({ theme }) => theme.calcRem(340)};
    }
    section {
      h1,
      li {
        width: 100%;
      }
    }
  }
`;

const Festival = ({ festival, togglePick, pickItems }) => {
  const { authState } = useContext(UserContext);
  const { setLoginModal } = useContext(ModalContext);
  const { festivalId, title, imageUrl, startDate, endDate, location } =
    festival;
  const [like, setLike] = useState(false);
  // console.log(festivalId);
  let navigate = useNavigate();

  const onErrorImg = (e) => {
    e.target.src = onErrorImage;
  };

  const onClickMoveDVP = (festivalId) => {
    navigate(`/Detail/${festivalId}`);
  };
  const toggleLike = () => {
    setLike(!like);
  };

  useEffect(() => {
    const isPicked = pickItems.some((ele) => ele.festivalId === festivalId);
    setLike(isPicked);
  }, [pickItems, festivalId]);

  const onClickPick = (event, festival) => {
    event.stopPropagation();
    togglePick(festival);
    toggleLike();
  };

  return (
    <Wrapper
      key={festivalId}
      onClick={() => {
        onClickMoveDVP(festivalId);
      }}
    >
      <img
        src={imageUrl || onErrorImage}
        alt={`${title} : 이미지가 존재하지 않습니다`}
        onError={(e) => onErrorImg(e)}
      />

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
            if (authState.loginStatus) {
              onClickPick(e, festival);
            } else {
              e.stopPropagation();
              setLoginModal(true);
            }
          }}
        >
          <img alt="heart" src={like ? HeartImg : EmptyHeartImg} />
        </button>
      </section>
    </Wrapper>
  );
};

export default Festival;
