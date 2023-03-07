import axios from 'axios';
import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import profileImg from '../assets/profile.png';
import CommentItem from './CommentItem';
import moment from 'moment';
import { useEffect } from 'react';
const Wrapper = styled.div`
  border: 1px solid lightgray;
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-flow: column;
  background-color: white;
  margin-left: 1rem;
  width: 90%;
  .content {
    display: flex;
    align-items: center;
    transition: all 1s;

    img {
      max-width: 3rem;
      border-radius: 50%;
      margin-right: 0.5rem;
    }
    textarea {
      transition: all 1s;
      flex: 1;
      /* border: 1px solid lightgray; */
      border-radius: 0.2rem;
      padding: 1rem;
      overflow: hidden;
    }
    .user-parent {
      background-color: var(--primaryOrange);
      color: white;
      border-radius: 0.2rem;
      padding: 0.3rem;
    }
  }

  .controller {
    display: flex;
    align-self: flex-end;

    button {
      background: var(--primaryOrange);
      border-radius: 0.2rem;
      width: 3.4rem;
      height: 1.7rem;
      color: white;
      :disabled {
        background-color: lightgray;
      }

      & + button {
        margin-left: 0.5rem;
      }
    }

    .write-cancel {
      color: black;
      background-color: white;
    }
  }
`;

type CommentWriteProps = {
  setReplying?: React.Dispatch<React.SetStateAction<boolean>>;
  authState: AuthState;
  review?: TReviewItem;
  commentWrite?: boolean;
  setCommentWrite?: React.Dispatch<React.SetStateAction<boolean>>;
  setCommentToggle?: React.Dispatch<React.SetStateAction<boolean>>;

  comment?: TComment;
  setComments?: React.Dispatch<React.SetStateAction<TComment[]>>;
};

const CommentWrite = ({
  setReplying,
  comment,
  authState,
  review,
  setCommentWrite,
  setCommentToggle,
  commentWrite,
  setComments,
}: CommentWriteProps) => {
  const [content, setContent] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const tempComment = useRef(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // console.log(comment);

  useEffect(() => {
    if (textareaRef.current) {
      console.log(textareaRef);

      textareaRef.current.focus();
    }
  }, []);
  /*
  리뷰의 정보를 알아야 함
  */

  const submitComment = async () => {
    /*
    제공할 정보 : 작성자의 정보, 리뷰의 정보, comment 정보

    리뷰 테이블에 필요한 것
    1. 댓글이 몇개 달렸는지 
    2. 좋아요 몇개인지
    
    */

    try {
      setLoading(true);
      const result = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/comments`,
        {
          parentComment: comment,
          content,
          reviewId: review?.id,
        },
        {
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken') ?? '',
          },
        }
      );

      console.log(result);
      tempComment.current = result.data;
      if (setComments) {
        setComments(result.data);
        setContent('');
        setCommentWrite && setCommentWrite(false);
        setCommentToggle && setCommentToggle(true);
        setReplying && setReplying(false);
      }
      setProgress('success');
      /*
      작성창 닫히고 업데이트된 댓글 보여주기
      */
    } catch (error) {
      setProgress('failure');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current?.scrollHeight + 'px';
    }
  };

  // if (!isLoading && progress === 'success' && tempComment.current) {
  //   return <CommentItem authState={authState} comment={tempComment.current} />;
  // }

  if (!isLoading && progress === 'failure') {
    return <div>Failure</div>;
  }
  return (
    <Wrapper>
      <div className="content">
        {authState.defaultPic ? (
          <img src={authState.defaultPic} alt="프로필사진" />
        ) : (
          <img src={profileImg} alt="프로필사진" />
        )}

        {comment && (
          <div className="user-parent">@{comment?.User.nickname}</div>
        )}
        <textarea
          ref={textareaRef}
          placeholder="여기에 작성해 주세요"
          spellCheck="false"
          onChange={(e) => {
            setContent(e.target.value);
            handleResizeHeight();
          }}
        ></textarea>
      </div>
      <div className="controller">
        <button
          className="write-cancel"
          onClick={() => {
            if (setCommentWrite) {
              setCommentWrite(false);
            }
            if (setReplying) {
              setReplying(false);
            }
          }}
        >
          취소
        </button>
        <button
          onClick={submitComment}
          disabled={content.length === 0 || isLoading}
        >
          답글
        </button>
      </div>
    </Wrapper>
  );
};

export default CommentWrite;
