import React, { useState, useContext } from "react";
import styled from "styled-components";
import moment from "moment";

import profileImg from "../../assets/profile.png";
import { ReactComponent as Setting } from "../../assets/setting.svg";

import { LoginModalDispatchContext } from "../../contexts/LoginModalContext";
import { UserContext } from "../../contexts/userContext";
import CommentWrite from "./CommentWrite";
import CommentDelete from "./CommentDelete";
import CommentEdit from "../comments/CommentEdit";
import CommentDropDown from "./CommentDropDown";

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
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > * + * {
      margin-left: 0.5rem;
    }
    & > div {
      display: flex;
      align-items: center;
    }
    img {
      max-height: 2rem;
      border-radius: 50%;
      margin-right: 0.5rem;
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
    display: flex;
    margin-top: 0.5rem;
    margin-left: 2rem;
    font-size: 0.9rem;
    & > span {
      color: var(--primaryOrange);
      font-weight: 600;
      padding-top: 5.5px;
    }

    p {
      flex: 1;
      margin: 0 1rem;
      word-break: break-all;
      line-height: 1.5;
    }
  }

  .content-bottom {
    display: flex;
    flex-flow: column;
    margin-top: 1rem;
    button {
      font-weight: 500;
    }
  }

  @media screen and (max-width: 764px) {
    .content-body {
      flex-flow: column;
      margin-left: 2.4rem;
      margin-right: 1rem;
      span {
        margin-bottom: 0.2rem;
      }
      p {
        padding: 0;
        padding-left: 0.8rem;
        padding-right: 0.4rem;

        margin: 0;
      }
    }
  }
  @media screen and (max-width: 600px) {
    .content-body {
      margin-left: 1rem;
      margin-right: 0.5rem;

      p {
        padding-left: 0.4rem;
      }
    }
  }

  @media screen and (max-width: 480px) {
    padding-bottom: 0.5rem;
    .content-header {
      margin-top: 0.5rem;
      .nicknameAndDate {
        display: flex;
        flex-flow: column;
        .createdAt {
          margin: 0;
          margin-top: 4px;
        }
      }
    }
    .content-body {
      margin-left: 0.5rem;
    }
  }
  @media screen and (max-width: 425px) {
    padding: 0.5rem;
    .content-header {
      .nickname {
        font-size: 0.8rem;
      }
      .createdAt {
        font-size: 0.7rem;
        span {
          font-size: 0.7rem;
        }
      }
    }
    .content-body {
      margin: 0;
      margin-top: 1rem;
      font-size: 0.8rem;

      p {
        padding: 0;
      }
    }
  }
`;

type CommentItemProps = {
  comment: TComment;
  // authState: AuthState;
  setComments: React.Dispatch<React.SetStateAction<TComment[]>>;
};

const CommentItem = ({ comment, setComments }: CommentItemProps) => {
  const { content, is_edit, createdAt, User, parent_nickname } = comment;
  const [isReplying, setReplying] = useState(false);
  const [isDrop, setIsDrop] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const userContext = useContext(UserContext);
  const setIsLoginModal = useContext(LoginModalDispatchContext);
  const createComment = () => {
    setReplying(!isReplying);
  };

  return (
    <>
      <Wrapper isEdit={isEdit}>
        {isDelete && (
          <CommentDelete
            setComments={setComments}
            comment={comment}
            setIsDelete={setIsDelete}
          />
        )}
        {isEdit && (
          <CommentEdit
            comment={comment}
            setComments={setComments}
            setIsEdit={setIsEdit}
          />
        )}
        {!isEdit && (
          <>
            <div className="content-header">
              <div>
                {User.defaultPic ? (
                  <img src={User.defaultPic} alt="프로필사진" />
                ) : (
                  <img src={profileImg} alt="프로필사진" />
                )}
                <div className="nicknameAndDate">
                  <span className="nickname">{User.nickname}</span>
                  <span className="createdAt">
                    {moment(createdAt).format("YYYY-MM-DD-h:mm")}
                    {is_edit && <span>(수정됨)</span>}
                  </span>
                </div>
              </div>
              {userContext?.authState.userId === comment.userId && (
                <button
                  className="setting"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDrop(!isDrop);
                  }}
                >
                  <Setting />
                </button>
              )}
              {isDrop && (
                <CommentDropDown
                  setIsDelete={setIsDelete}
                  setIsEdit={setIsEdit}
                  setIsDrop={setIsDrop}
                />
              )}
            </div>
            <div className="content-body">
              {parent_nickname && <span>@{parent_nickname}</span>}
              <p>{content}</p>
            </div>
            <div className="content-bottom">
              <div className="controller">
                {userContext?.authState.loginStatus &&
                  userContext?.authState.userId !== comment.userId && (
                    <button onClick={createComment}>답글</button>
                  )}
                {!userContext?.authState.loginStatus && (
                  <button onClick={() => setIsLoginModal(true)}>답글</button>
                )}
              </div>
            </div>
          </>
        )}
      </Wrapper>
      {isReplying && (
        <CommentWrite
          setComments={setComments}
          comment={comment}
          setReplying={setReplying}
        />
      )}
    </>
  );
};

export default CommentItem;
