import axios from 'axios';
import React, { useState } from 'react';
import Write from '../utilities/Write';
import CommentError from './CommentError';

type CommentWriteProps = {
  authState: AuthState;
  review?: TReviewItem;
  comment?: TComment;
  commentWrite?: boolean;
  setCommentWrite?: React.Dispatch<React.SetStateAction<boolean>>;
  setCommentToggle?: React.Dispatch<React.SetStateAction<boolean>>;
  setReplying?: React.Dispatch<React.SetStateAction<boolean>>;
  setComments?: React.Dispatch<React.SetStateAction<TComment[]>>;
};

const CommentWrite = ({
  setReplying,
  comment,
  review,
  setCommentWrite,
  setCommentToggle,
  setComments,
}: CommentWriteProps) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onError, setOnError] = useState(false);

  const submitComment = async () => {
    try {
      setIsLoading(true);
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

      // tempComment.current = result.data;
      if (setComments) {
        setComments(result.data);
        setContent('');
        setCommentWrite && setCommentWrite(false);
        setCommentToggle && setCommentToggle(true);
        setReplying && setReplying(false);
      }

      /*
      작성창 닫히고 업데이트된 댓글 보여주기
      */
    } catch (error) {
      setOnError(true);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitCancel = () => {
    if (setCommentWrite) {
      setCommentWrite(false);
    }
    if (setReplying) {
      setReplying(false);
    }
  };

  const onChangeComment = (content: string) => {
    setContent(content);
  };

  return (
    <>
      {onError && <CommentError setOnError={setOnError} />}
      <Write
        commentToReply={comment}
        wrapperStyle="default"
        onChangeContent={onChangeComment}
        submitCancel={submitCancel}
        submitContent={submitComment}
        isLoading={isLoading}
      ></Write>
    </>
  );
};

export default CommentWrite;
