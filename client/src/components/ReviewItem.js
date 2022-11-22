import React, { useState } from 'react';
import styled from 'styled-components';
import { AiFillStar } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';
import moment from 'moment';
import profileImg from '../assets/profile.png';

const Wrapper = styled.div`
  width: 100%;
  min-height: 199px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 1rem;

  & + & {
    margin-bottom: 1rem;
  }
  @media (max-width: 485px) {
    /* max-width: 380px;
    height: 199px; */
    border: 1px solid #d9d9d9;
    border-radius: 7px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.3rem;

  @media (max-width: 485px) {
    & .setting {
      padding-top: 3px;
      padding-left: 0;
    }
  }
`;

const Info = styled.div`
  display: flex;

  img {
    width: 49.13px;
    height: 48px;
    margin-right: 6px;
  }
  .nicknameAndDate {
    ul {
      padding: 0;
      li {
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
        color: #797979;
      }

      li:nth-child(1) {
        font-weight: 600;
        font-size: 18px;
        line-height: 22px;
        padding-top: 4px;
        color: #000000;
      }
    }
  }

  .rating {
    padding-left: 1rem;
    @media (max-width: 485px) {
      padding-top: 3px;
      padding-left: 0;
    }
  }
`;

const Body = styled.div`
  /* background-color: green; */
  padding-top: 22px;
  padding-left: 16px;
`;

const Button = styled.button`
  background: inherit;
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  overflow: visible;
  cursor: pointer;
`;
const Modal = styled.div`
  background-color: none;
  opacity: 1;
  height: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 0.5rem;
  margin: 0.4rem;
  padding: 0.3rem;

  & > h3 {
    position: relative;
    top: 1.5rem;
  }
  & button {
    margin: 1rem;
    width: 6rem;
    height: 2rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.2s;
    background-color: white;
    color: #ff9a62;
    line-height: 26px;
    border: 1px solid #d9d9d9;
    &:hover {
      transform: translateY(-0.1rem);
    }
    &:active {
      transform: translateY(0.1rem);
    }
  }

  & button:nth-child(1) {
    background: #ff9a62;
    border: none;
    color: white;
  }
  & button:nth-child(2) {
  }
`;

export const showRating = (rating, size = 18) => {
  const ratingArr = [1, 2, 3, 4, 5];
  return ratingArr.map((ele) => {
    const ratingValue = ele;
    return (
      <AiFillStar
        className="starr"
        key={ele}
        size={size}
        ele={ele}
        color={ratingValue <= rating ? `var(--mainColor)` : '#c6c6c6'}
      />
    );
  });
};

const Review = ({ review, authState, deleteReview }) => {
  const [deleteClicked, setDeleteClicked] = useState(false);
  const { rating, content, createdAt, User, festivalId, id } = review;
  console.log(review);
  const modalHandler = () => {
    setDeleteClicked(!deleteClicked);
  };

  const onClickDelete = (reviewId, festivalId) => {
    deleteReview(reviewId, festivalId);
  };

  return (
    <Wrapper>
      {deleteClicked ? (
        <Modal>
          <h3>리뷰를 정말 삭제하시겠습니까?</h3>
          <div>
            <button onClick={modalHandler}>취소하기</button>
            <button onClick={() => onClickDelete(id, festivalId)}>
              삭제하기
            </button>
          </div>
        </Modal>
      ) : (
        <>
          <Header>
            <Info>
              <img src={profileImg} alt="프로필사진" />
              <div className="nicknameAndDate">
                <ul>
                  <li>{User.nickname}</li>
                  <li>{moment(createdAt).format('YYYY-MM-DD')}</li>
                </ul>
              </div>
              <div className="rating">{showRating(rating)}</div>
            </Info>
            {Number(review.userId) === Number(authState.userId) && (
              <span className="setting">
                <Button onClick={modalHandler}>
                  <FaTrashAlt size={15} />
                </Button>
              </span>
            )}
          </Header>
          <Body>
            <p>{content}</p>
          </Body>
        </>
      )}
    </Wrapper>
  );
};

export default Review;
