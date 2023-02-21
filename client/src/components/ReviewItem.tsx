import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { AiFillStar } from 'react-icons/ai';
import moment from 'moment';
import profileImg from '../assets/profile.png';
import ReviewWrite from './ReviewWrite';
import { ReactComponent as Setting } from '../assets/setting.svg';
import { ReactComponent as Edit } from '../assets/edit.svg';
import { ReactComponent as Delete } from '../assets/delete.svg';
import { ReactComponent as Like } from '../assets/heart-fill.svg';
import { ReactComponent as Unlike } from '../assets/heart-empty.svg';

import CommentWrite from './CommentWrite';
import { useEffect } from 'react';
import axios from 'axios';
import CommentItem from './CommentItem';
import { useContext } from 'react';
import { ModalContext } from '../contexts/modalContext';
const Wrapper = styled.div<{ editMode?: boolean }>`
  ${(props) =>
    props.editMode &&
    css`
      display: flex;
      justify-content: center;
    `}
  /* background-color : lightblue; */
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  width: 100%;
  min-height: 199px;
  border-radius: 0.5rem;
  box-shadow: 0px 1px 0.2rem lightgrey;
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
  /* background-color: lightpink; */
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
    box-shadow: 1.5px 1.5px 3px lightgrey;
    border: 1px solid #d3d3d345;
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
  /* background-color: lightsalmon; */
  padding: 0.4rem 1rem;
  p {
    word-break: break-all;
    line-height: 1.5;
  }
`;
const Bottom = styled.div`
  /* position: relative; */
  /* display: flex; */
  /* background-color: yellow; */
  align-items: center;

  .reaction-info {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    button + button {
      margin-left: 1rem;
    }

    #comment-toggle {
      color: var(--primaryOrange);
      /* margin-left: 1rem; */
    }
  }
  .comment-list {
    /* position: absolute;
    top: 1.5rem;
    left: 3rem; */
    z-index: 9999;
    width: 90%;
    background-color: white;
  }

  .comment-toggle {
    button {
      color: var(--primaryOrange);
    }
  }
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
      like_num: 0,
    },
  });
  const [commentWrite, setCommentWrite] = useState(false);
  const [comments, setComments] = useState<TComment[]>([]);
  const [commentToggle, setCommentToggle] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const {
    rating,
    content,
    createdAt,
    updatedAt,
    User,
    festivalId,
    id,
    like_num,
  } = review;
  const modalContext = useContext(ModalContext);
  // console.log(review);
  console.log(comments);

  const modalHandler = () => {
    setDeleteClicked(!deleteClicked);
  };

  const onClickDelete = (reviewId: number, festivalId: number) => {
    deleteReview(reviewId, festivalId);
  };

  const toggleLike = () => {
    /*
    필요한 정보
    해당 댓글을 내가 좋아요 했는지 안했는지

    */
  };

  const createComment = () => {
    setCommentWrite(!commentWrite);
  };

  const getComments = async (reviewId: number) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/comments/${reviewId}`
      );
      let comments;
      if (result.status === 204 && result.statusText === 'No Content') {
        comments = [];
      } else {
        comments = result.data;
      }

      setComments(comments);
    } catch (error) {
      console.log(error);
    }
  };

  const showComments = () => {
    setCommentToggle(!commentToggle);
  };

  useEffect(() => {
    getComments(id);
  }, []);

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
          <Bottom>
            <div className="reaction-info">
              <button
                onClick={(e) => {
                  console.log('here');

                  if (authState.loginStatus) {
                    // onClickPick(e, summary.festival);
                  } else {
                    e.stopPropagation();
                    console.log('login');

                    if (modalContext) {
                      modalContext.setLoginModal(true);
                    }
                  }
                }}
              >
                {isLike ? <Like alt="liked" /> : <Unlike alt="unliked" />}
                {like_num}
              </button>

              <button onClick={createComment}>댓글</button>

              {comments.length ? (
                <button id="comment-toggle" onClick={showComments}>
                  답글 {comments.length}개
                </button>
              ) : null}
            </div>
            {commentWrite && (
              <CommentWrite
                authState={authState}
                commentWrite={commentWrite}
                setCommentWrite={setCommentWrite}
                review={review}
                setComments={setComments}
              />
            )}

            <div className="comment-list">
              {commentToggle &&
                comments.map((comment) => (
                  <CommentItem
                    setComments={setComments}
                    authState={authState}
                    key={comment.id}
                    comment={comment}
                    // setCommentWrite={setCommentWrite}
                  />
                ))}
            </div>
          </Bottom>
        </>
      )}
    </Wrapper>
  );
};

export default ReviewItem;
