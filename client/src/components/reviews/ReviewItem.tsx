import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import moment from "moment";
import axios from "axios";

import profileImg from "../../assets/profile.png";
import { AiFillStar } from "react-icons/ai";
import { ReactComponent as Setting } from "../../assets/setting.svg";

import { LoginModalContext } from "../../contexts/LoginModalContext";
import CommentWrite from "../comments/CommentWrite";
import CommentItem from "../comments/CommentItem";
import ReviewDropdown from "./ReviewDropdown";
import ReviewEdit from "./ReviewEdit";
import ReviewDelete from "./ReviewDelete";
import { UserContext } from "../../contexts/userContext";

const CommentList = styled.div`
  z-index: 10;
  width: 100%;
  padding-left: 1rem;
  background-color: white;
  @media screen and (max-width: 425px) {
    width: auto;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;
const Wrapper = styled.li`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  width: 100%;
  min-height: 199px;
  border: 0.8px solid #d9d9d9;
  box-shadow: 0 2px 5px #e6e2e2;
  border-top: none;
  border-radius: 0.8rem;
  padding: 1rem;
  position: relative;
  & + div {
    margin-top: 0.5rem;
  }

  @media (max-width: 485px) {
  }

  @media screen and (max-width: 360px) {
    padding: 0.8rem;
  }
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.3rem;

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
  @media (max-width: 425px) {
    .nicknameAndDate {
      li {
        font-size: 0.9rem;
        margin-right: 0.5rem;
      }
    }
  }
`;
const Info = styled.div`
  display: flex;

  width: 100%;
  .left {
    display: flex;
    img {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }
    .nicknameAndDate {
      margin-left: 0.9rem;
      margin-top: 2px;
      display: flex;
      flex-flow: column;
      justify-content: center;
      #nickname {
        font-weight: 600;
        padding-top: 4px;
      }
      #date {
        font-weight: 400;
        font-size: 14px;
        margin-top: 0.3rem;
        color: #797979;
      }
    }
  }

  .rating {
    display: flex;
    margin-left: 1rem;
    margin-top: 0.5rem;
    @media (max-width: 485px) {
      padding-top: 3px;
      padding-left: 0;
    }

    @media screen and (max-width: 385px) {
      display: none;
    }
  }

  .rating-mobile {
    display: none;
  }
  @media screen and (max-width: 410px) {
    img {
      width: 2.5rem;
    }

    .rating {
      display: none;
    }
    .rating-mobile {
      display: flex;
      justify-content: center;

      position: absolute;
      right: 3.2rem;
      top: 13px;
      svg {
        margin-right: 0.5rem;
        color: var(--primaryPurple);
        width: 1.2rem;
        height: 1.2rem;
      }

      span {
        font-size: 18px;
        font-weight: 500;
        padding-top: 2px;
      }
    }
  }

  @media screen and (max-width: 340px) {
    .rating-mobile {
      right: 2.5rem;
      top: 13px;
      svg {
        margin-right: 0.5rem;
        color: var(--primaryPurple);
        width: 1rem;
        height: 1rem;
      }

      span {
        font-size: 1rem;
        font-weight: 500;
        padding-top: 2px;
      }
    }
  }
`;
const Body = styled.div`
  padding: 0.4rem 1rem;
  p {
    word-break: break-all;
    line-height: 1.5;
  }
  @media screen and (max-width: 360px) {
    font-size: 0.9rem;
  }
`;
const Bottom = styled.div`
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
    }
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

export const showRating = (rating: number, size = 18) => {
  const ratingArr = [1, 2, 3, 4, 5];
  return ratingArr.map((ele) => {
    const ratingValue = ele;
    return (
      <AiFillStar
        className="starr"
        key={ele}
        size={size}
        color={ratingValue <= rating ? `var(--mainColor)` : "#c6c6c6"}
      />
    );
  });
};

type ReviewProps = {
  review: TReviewItem;
  updateReviews: (
    type: "CREATE" | "UPDATE" | "DELETE",
    reviewItem: TReviewItem
  ) => void;
};

const ReviewItem = ({ review, updateReviews }: ReviewProps) => {
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDrop, setIsDrop] = useState(false);
  const [commentWrite, setCommentWrite] = useState(false);
  const [comments, setComments] = useState<TComment[]>([]);
  const [commentToggle, setCommentToggle] = useState(false);
  const { rating, content, createdAt, updatedAt, User, id } = review;
  const { setIsLoginModal } = useContext(LoginModalContext);
  const userContext = useContext(UserContext);
  const createComment = () => {
    setCommentWrite(!commentWrite);
  };

  const getComments = async (reviewId: number) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/comments/${reviewId}`
      );
      let comments;
      if (result.status === 204 && result.statusText === "No Content") {
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

  if (isEdit)
    return (
      <ReviewEdit
        review={review}
        setIsEdit={setIsEdit}
        updateReviews={updateReviews}
      />
    );

  return (
    <>
      <Wrapper
        onClick={(e) => {
          if (isDrop) {
            setIsDrop(false);
          }
        }}
      >
        {isDelete && (
          <ReviewDelete
            review={review}
            setIsDelete={setIsDelete}
            updateReviews={updateReviews}
          />
        )}

        <>
          <Header>
            {isDrop && (
              <ReviewDropdown
                setIsDelete={setIsDelete}
                setIsEdit={setIsEdit}
                info={review}
              />
            )}
            <Info>
              <section className="left">
                {User?.defaultPic ? (
                  <img src={User.defaultPic} alt="프로필사진" />
                ) : (
                  <img src={profileImg} alt="프로필사진" />
                )}
                <ul className="nicknameAndDate">
                  <li id="nickname">
                    {User ? User.nickname : "탈퇴한 회원입니다"}
                  </li>
                  <li id="date">
                    {moment(createdAt).format("YYYY-MM-DD")}{" "}
                    {createdAt !== updatedAt && "수정됨"}
                  </li>
                </ul>
              </section>
              <div className="rating">{showRating(rating)}</div>
              <div className="rating-mobile">
                <AiFillStar />
                <span>{rating}</span>
              </div>
            </Info>
            {Number(review.userId) ===
              Number(userContext?.authState.userId) && (
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
              {userContext?.authState.loginStatus ? (
                <button onClick={createComment}>댓글</button>
              ) : (
                <button onClick={() => setIsLoginModal(true)}>댓글</button>
              )}

              {comments.length ? (
                <button id="comment-toggle" onClick={showComments}>
                  댓글 {comments.length}개
                </button>
              ) : null}
            </div>
          </Bottom>
        </>
      </Wrapper>
      {commentWrite && (
        <CommentWrite
          commentWrite={commentWrite}
          setCommentWrite={setCommentWrite}
          setCommentToggle={setCommentToggle}
          review={review}
          setComments={setComments}
        />
      )}
      <CommentList>
        {commentToggle &&
          comments.map((comment) => (
            <CommentItem
              setComments={setComments}
              // authState={authState}
              key={comment.id}
              comment={comment}
            />
          ))}
      </CommentList>
    </>
  );
};

export default ReviewItem;
