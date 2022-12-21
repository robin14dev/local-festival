import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import onErrorImage from '../assets/noimage.png';
import { UserContext } from '../contexts/userContext';
import { ModalContext } from '../contexts/modalContext';
import HeartImg from '../assets/heart.png';
import EmptyHeartImg from '../assets/empty-heart.png';
import '../styles/common.scss';
import { useCallback } from 'react';
export const Wrapper = styled.article`
  width: 25%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  & > img {
    max-width: 100%;
    aspect-ratio: 1/1;
    border-radius: 10px;
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

  @media screen and (max-width: 1100px) {
    width: 33%;
  }
  @media screen and (max-width: 923px) {
    width: 50%;
  }
  @media screen and (max-width: 521px) {
    width: 100%;
  }
  @media (max-width: 485px) {
    /* margin: 0.5rem 0;
    width: ${({ theme }) => theme.calcRem(357)}; */

    &:hover {
      transform: none;
    }

    section {
      h1,
      li {
        width: 100%;
      }
    }
  }
`;

const Status = styled.div<{ status: string }>`
  /* 오늘 : 1201
       endDate가 1201 이전이면 종료
       startDate가 1201이하이면서 endDate가 1201~ 이면 진행중
       startDate가 1201초과이면 진행전
       endDate가 1201이전이면 종료
       오늘을 기준으로 startDate가 오늘 초과면 진행전, endDate가 오늘 이전이면 종료 나머지는 다 진행중

1
2
3
4
5




    */
  position: absolute;
  width: 52px;
  height: 26px;
  border-radius: 0.5rem 0.1rem 0.4rem 0.1rem;

  background-color: ${({ status }) =>
    status === 'scheduled'
      ? `var(--primaryBlue)`
      : status === 'completed'
      ? '#4e4d4d'
      : `var(--primaryOrange)`};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

type FestivalProps = {
  festival: FestivalItem;
  togglePick: togglePick;
  pickItems: FestivalItem[];
};

const Festival = ({ festival, togglePick, pickItems }: FestivalProps) => {
  const userContext = useContext(UserContext);
  const modalContext = useContext(ModalContext);
  const { festivalId, title, imageUrl, startDate, endDate, location } =
    festival;
  const [like, setLike] = useState(false);
  let navigate = useNavigate();

  const onErrorImg = (e: React.ChangeEvent<HTMLImageElement>) => {
    e.target.src = onErrorImage;
  };

  const onClickMoveDVP = (festivalId: number) => {
    navigate(`/Detail/${festivalId}`);
  };
  const toggleLike = () => {
    setLike(!like);
  };

  const onClickPick = (
    e: React.MouseEvent<HTMLButtonElement>,
    festival: FestivalItem
  ) => {
    e.stopPropagation();
    togglePick(festival);
    toggleLike();
  };

  const todayFunc = useCallback((): number => {
    let now = new Date();
    let year = now.getFullYear().toString();
    let month = now.getMonth() + 1;
    let convertMonth;
    let convertDate;
    let date = now.getDate();

    if (month < 10) {
      convertMonth = '0' + month;
    } else {
      convertMonth = month;
    }
    if (date < 10) {
      convertDate = '0' + date;
    } else {
      convertDate = date;
    }

    return Number(year + convertMonth + convertDate);
  }, []);

  const showStatus = useCallback((startDate: number, endDate: number) => {
    const status = {
      scheduled: '예정',
      completed: '종료',
      inProgress: '진행중',
    };

    const today = todayFunc();

    // 순서 중요
    if (today < startDate) {
      // 예정
      return Object.entries(status)[0];
    }
    if (today > endDate) {
      return Object.entries(status)[1];
    }
    return Object.entries(status)[2];
  }, []);

  useEffect(() => {
    const isPicked = pickItems.some((ele) => ele.festivalId === festivalId);
    setLike(isPicked);
  }, [pickItems, festivalId]);

  return (
    <Wrapper
      key={festivalId}
      onClick={() => {
        onClickMoveDVP(festivalId);
      }}
    >
      <Status status={showStatus(startDate, endDate)[0]}>
        {showStatus(startDate, endDate)[1]}
      </Status>
      <img
        src={imageUrl || onErrorImage}
        alt={`${title} : 이미지가 존재하지 않습니다`}
        onError={onErrorImg}
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
            if (userContext) {
              if (userContext.authState.loginStatus) {
                onClickPick(e, festival);
              } else {
                e.stopPropagation();
                if (modalContext) {
                  modalContext.setLoginModal(true);
                }
              }
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
