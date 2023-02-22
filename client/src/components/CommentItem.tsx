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
import { useRef } from 'react';
const Wrapper = styled.div<{ isEdit: boolean }>`
  border-radius: 0.5rem;
  box-shadow: 0px 1px 0.2rem lightgrey;
  padding: 1rem;
  padding-right: 0.5rem;
  padding-bottom: ${(props) => props.isEdit && 0};
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
    .createdAt {
      color: gray;
      margin-left: 1rem;
      span {
        margin-left: 0.5rem;
        font-size: 0.9rem;
      }
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
      color: var(--primaryOrange);
      border-radius: 0.7rem;
      font-weight: 500;
      font-size: 1rem;
      transition: all 0.3s;
      & + button {
        margin-left: 1rem;
      }
      &:hover {
        background-color: #feccaf33;
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

  .edit {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: white;
    display: flex;
    justify-content: space-between;
    border-radius: 1rem;
    padding: 1rem;
    span {
      width: 7%;
      img {
        width: 100%;
      }
    }
    section {
      flex: 1;
      display: flex;
      flex-flow: column;
      margin-left: 1rem;
      /* background-color: yellow; */
      /* justify-content: space-between; */

      textarea {
        padding: 1rem;
        /* background-color: yellowgreen; */
        /* min-height: 5rem; */
        overflow: hidden;
        border-radius: 0.5rem;
        border: 1px solid #fcb086b8;
      }
      .controller {
        align-self: flex-end;
        margin-top: 1rem;
        /* background-color: red; */

        button {
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.3s;
          padding: 0.5rem 0.8rem;
          background-color: white;
          border-radius: 0.9rem;
          & + button {
            margin-left: 0.5rem;
          }
          &:hover {
            filter: brightness(95%);
          }
          &#submit {
            background-color: var(--primaryOrange);
            /* border-radius: 0.9rem; */
            color: white;
            &:disabled {
              background-color: lightgray;
              &:hover {
                filter: brightness(95%);
              }
            }

            &:hover {
              filter: brightness(105%);
            }
          }
        }
      }
    }
  }
`;

type CommentItemProps = {
  comment: TComment;
  authState: AuthState;
  setComments: React.Dispatch<React.SetStateAction<TComment[]>>;
  // setCommentWrite?: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentItem = ({
  comment,
  authState,
  setComments,
}: // setCommentWrite,
CommentItemProps) => {
  const { content, updatedAt, createdAt, User, parent_nickname, id } = comment;
  const [isReplying, setReplying] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isDrop, setIsDrop] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState({ update: false, delete: false });
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
      setIsLoading((prev) => ({ ...prev, delete: true }));
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
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const Alert = () => {
    return (
      <div className="alert">
        <p>댓글을 완전히 삭제할까요?</p>
        <div>
          <button
            onClick={() => {
              setIsDelete(false);
            }}
          >
            취소
          </button>
          <button
            className={isLoading.delete ? 'loading' : undefined}
            onClick={deleteComment}
          >
            삭제
          </button>
        </div>
      </div>
    );
  };

  type EditModeProps = {
    setComments: React.Dispatch<React.SetStateAction<TComment[]>>;
  };

  const EditMode = ({ setComments }: EditModeProps) => {
    const [editContent, setEditContent] = useState(content);
    const textareaRef = useRef<null | HTMLTextAreaElement>(null);

    const handleEditContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      console.log(e.target.value);

      setEditContent(e.target.value);
    };

    const handleResizeHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + 'px';
      }
    };

    const submitEditContent = async () => {
      try {
        /*
        댓글 아이디, 
        */
        const commentId = id;
        setIsLoading((prev) => ({ ...prev, update: true }));
        const result = await axios.patch(
          `${process.env.REACT_APP_SERVER_URL}/comments`,
          { id, content: editContent },
          {
            headers: {
              accesstoken: sessionStorage.getItem('accesstoken') ?? '',
            },
          }
        );
        /*
        
        */
        const { content, updatedAt } = result.data;
        setEditContent('');
        setComments((prevComments) => {
          return prevComments.map((comment) =>
            comment.id === id ? { ...comment, content, updatedAt } : comment
          );
        });
        setIsEdit(false);
        setIsDrop(false);
        // console.log(result);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading((prev) => ({ ...prev, update: false }));
      }
    };

    return (
      <div className="edit">
        <span>
          <img src={profileImg} alt="프로필사진" />
        </span>
        <section>
          <textarea
            onChange={(e) => {
              handleResizeHeight();
              handleEditContent(e);
            }}
            ref={textareaRef}
            rows={1}
            value={editContent}
          />
          <div className="controller">
            <button
              onClick={() => {
                setIsEdit(false);
              }}
            >
              취소
            </button>
            <button
              onClick={submitEditContent}
              id="submit"
              disabled={editContent.length === 0 || editContent === content}
            >
              저장
            </button>
          </div>
        </section>
      </div>
    );
  };

  return (
    <Wrapper
      isEdit={isEdit}
      // onClick={(e) => {
      //   e.stopPropagation();
      //   console.log('gg');

      //   setIsDrop(false);
      // }}
    >
      {isDelete && <Alert />}
      {isEdit && <EditMode setComments={setComments} />}
      {!isEdit && (
        <>
          {' '}
          <div className="content-header">
            <span>
              <img src={profileImg} alt="프로필사진" />
              <div className="nickname">{User.nickname}</div>
              <div className="createdAt">
                {updatedAt !== createdAt ? (
                  <>
                    {moment(updatedAt).format('YYYY-MM-DD-h:mm')}
                    <span>(수정됨)</span>
                  </>
                ) : (
                  moment(createdAt).format('YYYY-MM-DD-h:mm')
                )}
              </div>
              {/* {updatedAt !== createdAt && <span>수정됨</span>} */}
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
                    <li
                      onClick={() => {
                        setIsEdit(true);
                        setIsDrop(false);
                      }}
                    >
                      <Edit />
                      수정하기
                    </li>
                    <li
                      onClick={() => {
                        setIsDelete(true);
                        setIsDrop(false);
                      }}
                    >
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
        </>
      )}
    </Wrapper>
  );
};

export default CommentItem;
