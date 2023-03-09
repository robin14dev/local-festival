import axios from 'axios';
import React, { useRef, useState } from 'react';
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
  const tempComment = useRef(null);

  const submitComment = async () => {
    /*
    제공할 정보 : 작성자의 정보, 리뷰의 정보, comment 정보

    리뷰 테이블에 필요한 것
    1. 댓글이 몇개 달렸는지 
    2. 좋아요 몇개인지
    
    */

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

      tempComment.current = result.data;
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

/**

- 댓글쓰기 (부모글 존재 x)
ReviewItem => CommentWrite => Write   

- 답글쓰기 (부모글 존재 o)
CommentItem ={comment}=> CommentWrite => Write   

- 댓글, 답글 수정하기

- CommentItem => CommentEdit => Write  (부모글이 없는 '댓글' 수정)
- CommentItem ={comment}=> CommentEdit => Write  (부모글이 있는 '답글' 수정)

 */
