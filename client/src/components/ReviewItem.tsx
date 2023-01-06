import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { AiFillStar } from 'react-icons/ai';
import moment from 'moment';
import profileImg from '../assets/profile.png';
import ReviewWrite from './ReviewWrite';
import { ReactComponent as Setting } from '../assets/setting.svg';
import { ReactComponent as Edit } from '../assets/edit.svg';
import { ReactComponent as Delete } from '../assets/delete.svg';
const Wrapper = styled.div<{ editMode?: boolean }>`
  ${(props) =>
    props.editMode &&
    css`
      display: flex;
      justify-content: center;
    `}

  width: 100%;
  min-height: 199px;
  border-bottom: 1px solid #d9d9d9;
  padding: 1rem;
  margin-bottom: 0.5rem;

  @media (max-width: 485px) {
    border: 1px solid #d9d9d9;
    border-radius: 7px;

    ${(props) =>
      props.editMode &&
      css`
        border: none;
        padding: 0;
      `}
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.3rem;
  position: relative;

  .dropdown {
    transition: transform 0.6s ease-in-out;
    transition: 0.3s ease;
    animation: toast-in-right 0.6s;

    @keyframes toast-in-right {
      from {
        transform: translateX(20%);
      }
      to {
        transform: translateX(0);
      }
    }
    width: 8rem;
    height: 5rem;
    position: absolute;
    right: 2rem;
    background-color: yellow;
    display: flex;
    align-items: center;
    line-height: 1.4;
    box-shadow: 1px 1.5px 2px gray;
    background-color: white;
    border-radius: 0.5rem;
    overflow: hidden;

    ul {
      width: 100%;
      height: 100%;
      li {
        display: flex;
        align-items: center;
        height: 50%;
        padding: 0 0.5rem;
        cursor: pointer;
        &:hover {
          background-color: #f4f4f4;
        }
        &:active {
          background-color: white;
        }
        svg {
          margin-right: 1.8rem;
        }
      }
    }
  }

  .setting {
    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

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
    display: flex;
    padding-left: 1rem;
    @media (max-width: 485px) {
      padding-top: 3px;
      padding-left: 0;
    }
  }
`;

const Body = styled.div`
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

export const showRating = (rating: number, size = 18) => {
  const ratingArr = [1, 2, 3, 4, 5];
  return ratingArr.map((ele) => {
    const ratingValue = ele;
    return (
      <AiFillStar
        className="starr"
        key={ele}
        size={size}
        // ele={ele}
        color={ratingValue <= rating ? `var(--mainColor)` : '#c6c6c6'}
      />
    );
  });
};

type ReviewProps = {
  review: TReviewItem;
  authState: AuthState;
  deleteReview: (reviewId: number, festivalId: number) => void;
  updateReviewList: (newReview: TReviewItem) => void;
  updateReview?: (updatedItem: TReviewItem) => void;
};

const ReviewItem = ({
  review,
  authState,
  deleteReview,
  updateReviewList,
  updateReview,
}: ReviewProps) => {
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [isDrop, setIsDrop] = useState(false);
  const [editItem, setEditItem] = useState<EditItem>({
    isEdit: false,
    info: {
      User: {
        nickname: '',
      },
      content: '',
      createdAt: '',
      festivalId: 0,
      id: 0,
      rating: 0,
      updatedAt: '',
      userId: 0,
    },
  });
  const { rating, content, createdAt, updatedAt, User, festivalId, id } =
    review;
  const modalHandler = () => {
    setDeleteClicked(!deleteClicked);
  };

  const onClickDelete = (reviewId: number, festivalId: number) => {
    deleteReview(reviewId, festivalId);
  };

  return (
    <Wrapper
      editMode={editItem.isEdit}
      onClick={(e) => {
        if (isDrop) {
          setIsDrop(false);
        }
      }}
    >
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
      ) : editItem?.isEdit ? (
        <ReviewWrite
          authState={authState}
          festivalId={festivalId}
          updateReviewList={updateReviewList}
          editItem={editItem}
          setEditItem={setEditItem}
          updateReview={updateReview}
        />
      ) : (
        <>
          <Header>
            {isDrop && (
              <div className="dropdown">
                <ul>
                  <li
                    onClick={() => {
                      setEditItem((prev) => ({
                        ...prev,
                        isEdit: true,
                        info: review,
                      }));
                    }}
                  >
                    <Edit /> 수정하기
                  </li>
                  <li onClick={modalHandler}>
                    {' '}
                    <Delete />
                    삭제하기
                  </li>
                </ul>
              </div>
            )}
            <Info>
              <img src={profileImg} alt="프로필사진" />
              <div className="nicknameAndDate">
                <ul>
                  <li>{User ? User.nickname : '탈퇴한 회원입니다'}</li>
                  <li>
                    {moment(createdAt).format('YYYY-MM-DD')}{' '}
                    {createdAt !== updatedAt && '수정됨'}
                  </li>
                </ul>
              </div>
              <div className="rating">{showRating(rating)}</div>
            </Info>
            {Number(review.userId) === Number(authState.userId) && (
              <span className="setting">
                <Button onClick={() => setIsDrop(!isDrop)}>
                  <Setting />
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

export default ReviewItem;
