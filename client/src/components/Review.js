import React, { useState } from 'react';
import styled from 'styled-components';
import { AiFillStar } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';
import moment from 'moment';

const Wrapper = styled.div`
  width: 98%;
  height: 10rem;
  margin-bottom: 1rem;
  box-shadow: 0.1rem 0.1rem 0.3rem #9a9999;

  background-color: #fbfbfb;
  border-radius: 0.5rem;
  margin: 0.4rem;
  padding: 0.8rem 0.5rem;
  overflow: scroll;
  /* text-overflow: ellipsis; */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.3rem;
  /* background-color: yellow; */
`;

const Info = styled.div`
  display: flex;

  & > div {
    margin: 0 0.3rem 0 0;
  }
`;

const Date = styled.div`
  color: gray;
  letter-spacing: -0.08rem;
  line-height: 1rem;
`;

const Body = styled.div`
  /* background-color: yellow; */
  margin: 0.3rem 0.1rem;
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
    background-color: aqua;
    margin: 1rem;
    width: 6rem;
    height: 2rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.2s;

    &:hover {
      transform: translateY(-0.1rem);
    }
    &:active {
      transform: translateY(0.1rem);
    }
  }

  & button:nth-child(1) {
    background-color: #1564a9;

    color: white;
  }
  & button:nth-child(2) {
    background-color: #05c299;
    color: white;
  }
`;

const Review = ({ review, authState, deleteReview }) => {
  const [deleteClicked, setDeleteClicked] = useState(false);

  const { rating, content, createdAt, User, festivalId, id } = review;
  const modalHandler = () => {
    setDeleteClicked(!deleteClicked);
  };

  const onClickDelete = (reviewId, festivalId) => {
    // setDeleteClicked(!deleteClicked)
    deleteReview(reviewId, festivalId);
  };
  const showRating = (rating) => {
    const ratingArr = [1, 2, 3, 4, 5];
    return ratingArr.map((ele) => {
      // 리턴을 두번 해줘야됨 !!!
      const ratingValue = ele;
      return (
        <AiFillStar
          size={18}
          color={ratingValue <= rating ? 'var(--primaryBlue)' : '#c6c6c6'}
        />
      );
    });
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
              <div>{showRating(rating)}</div>
              <div
                style={{
                  color: 'gray',
                  lineHeight: '1rem',
                  fontWeight: '700',
                  marginLeft: '0.2rem',
                }}
              >
                {' '}
                {User.nickname}
              </div>
              <Date>{moment(createdAt).format('YYYY-MM-DD')}</Date>
            </Info>
            {Number(review.userId) === Number(authState.userId) && (
              <span>
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
