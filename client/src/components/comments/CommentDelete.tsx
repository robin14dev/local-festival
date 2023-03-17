import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { mixin } from '../../styles/theme';
import CommentError from './CommentError';

type CommentDeleteProps = {
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setComments: React.Dispatch<React.SetStateAction<TComment[]>>;
  comment: TComment;
};

const Wrapper = styled.article`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(255 255 255 / 95%);
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
      background-color: rgb(255 154 98 / 35%);
    }
  }

  .loading {
    position: relative;
    color: transparent;
    transition: all 0.2s;
    background-color: rgb(255 154 98 / 35%);
    &::after {
      ${mixin.spinner('4px solid antiquewhite', `var(--primaryOrange)`)}
    }
  }
`;

export default function CommentDelete({
  setIsDelete,
  setComments,
  comment,
}: CommentDeleteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [onError, setOnError] = useState(false);
  const { id } = comment;

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
      setOnError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {onError && <CommentError setOnError={setOnError} />}
      <Wrapper>
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
            className={isLoading ? 'loading' : undefined}
            onClick={deleteComment}
          >
            삭제
          </button>
        </div>
      </Wrapper>
    </>
  );
}
