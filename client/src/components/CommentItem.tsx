import React, { useState } from 'react';
import styled from 'styled-components';
import profileImg from '../assets/profile.png';
import CommentWrite from './CommentWrite';
import moment from 'moment';
import { ReactComponent as Like } from '../assets/heart-fill.svg';
import { ReactComponent as Unlike } from '../assets/heart-empty.svg';
import { ReactComponent as Edit } from '../assets/edit.svg';
import { ReactComponent as Delete } from '../assets/delete.svg';
import { ReactComponent as Setting } from '../assets/setting.svg';

import Dropdown from './Dropdown';
import axios from 'axios';
const Wrapper = styled.div`
  border-radius: 0.5rem;
  box-shadow: 0px 1px 0.2rem lightgrey;
  padding: 1rem;
  padding-right: 0.5rem;
  margin-top: 0.5rem;
  margin-left: 1rem;
  display: flex;
  flex-flow: column;
  position: relative;
  .content-header {
    /* background-color: yellowgreen; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > * + * {
      margin-left: 0.5rem;
    }
    & > span {
      display: flex;
      align-items: center;
    }
    img {
      max-height: 2rem;
    }

    .nickname {
      font-weight: 600;
      font-size: 1rem;
    }
    .updatedAt {
      color: gray;
      margin-left: 1rem;
    }

    button {
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
  }

  .content-body {
    /* background-color: yellow; */
    display: flex;
    margin-top: 1rem;
    margin-left: 2.5rem;
    font-size: 0.9rem;
    & > span {
      color: var(--primaryOrange);
      font-weight: 600;
    }

    p {
      flex: 1;
      margin-left: 1rem;
    }
  }

  .content-bottom {
    display: flex;
    flex-flow: column;
    /* background-color: palegoldenrod; */
    margin-top: 1rem;
    & > div {
      /* display: flex;
      align-items: center; */
    }
  }

  .alert {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffffde;
    overflow: auto;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    p {
      margin-bottom: 1rem;
      font-weight: 500;
    }

    button {
      padding: 0.5rem 1.4rem;
      background-color: var(--primaryOrange);
      border-radius: 0.7rem;
      font-weight: 500;
      font-size: 1rem;
      color: white;
      & + button {
        margin-left: 1rem;
      }
    }

    .loading {
      position: relative;
      color: transparent;
      transition: all 0.2s;
      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border: 4px solid var(--primaryOrange);
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: button-loading-spinner 1s ease infinite;
      }

      @keyframes button-loading-spinner {
        from {
          transform: rotate(0turn);
        }

        to {
          transform: rotate(1turn);
        }
      }
    }
  }
`;

type CommentItemProps = {
  comment: TComment;
  authState: AuthState;
  setComments?: React.Dispatch<React.SetStateAction<TComment[]>>;
  // setCommentWrite?: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentItem = ({
  comment,
  authState,
  setComments,
}: // setCommentWrite,
CommentItemProps) => {
  const { content, updatedAt, User, parent_nickname, id } = comment;
  const [isReplying, setReplying] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isDrop, setIsDrop] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createComment = () => {
    setReplying(!isReplying);
  };
  /*
  필요 정보

  댓글 작성자 닉네임
  댓글 작성 시간
  댓글 내용
  댓글 좋아요수

  부모글이 있는 경우 부모글의 닉네임

  
  
  
  */

  const deleteComment = async () => {
    try {
      setIsLoading(true);
      const result = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/comments`,
        {
          data: { id },
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken') ?? '',
          },
        }
      );
      console.log(result);
      if (result.data.message === 'delete comment success') {
        if (setComments) {
          setComments((prevComments) => {
            return prevComments.filter((comment) => comment.id !== id);
          });
        }
        setIsDelete(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const Alert = () => {
    return (
      <div className="alert">
        <p>댓글을 완전히 삭제할까요?</p>
        <div>
          <button onClick={() => setIsDelete(false)}>취소</button>
          <button
            className={isLoading ? 'loading' : undefined}
            onClick={deleteComment}
          >
            삭제
          </button>
        </div>
      </div>
    );
  };

  return (
    <Wrapper
      onClick={() => {
        // e.stopPropagation();
        console.log('gg');

        setIsDrop(false);
      }}
    >
      {isDelete && <Alert />}
      <div className="content-header">
        <span>
          <img src={profileImg} alt="프로필사진" />
          <div className="nickname">{User.nickname}</div>
          <div className="updatedAt">
            {moment(updatedAt).format('YYYY-MM-DD-h:mm')}
          </div>
        </span>
        {authState.userId === comment.userId && (
          <button
            className="setting"
            onClick={(e) => {
              e.stopPropagation();
              console.log('gg');

              setIsDrop(!isDrop);
            }}
          >
            <Setting />
          </button>
        )}
        {isDrop && (
          <Dropdown>
            {
              <>
                <li>
                  <Edit />
                  수정하기
                </li>
                <li onClick={() => setIsDelete(true)}>
                  <Delete />
                  삭제하기
                </li>
              </>
            }
          </Dropdown>
        )}
      </div>
      <div className="content-body">
        {parent_nickname && <span>@{parent_nickname}</span>}
        <p>{content}</p>
      </div>
      <div className="content-bottom">
        <div>
          <button
            onClick={(e) => {
              if (authState.loginStatus) {
                // onClickPick(e, summary.festival);
              } else {
                e.stopPropagation();
                // if (modalContext) {
                //   modalContext.setLoginModal(true);
                // }
              }
            }}
          >
            {isLike ? <Like alt="liked" /> : <Unlike alt="unliked" />}
            {/* {likes} */}
          </button>
          {authState.userId !== comment.userId && (
            <button onClick={createComment}>답글</button>
          )}
        </div>

        {isReplying && (
          <CommentWrite
            setComments={setComments}
            comment={comment}
            authState={authState}
            setReplying={setReplying}
            // setCommentWrite={setCommentWrite}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default CommentItem;
