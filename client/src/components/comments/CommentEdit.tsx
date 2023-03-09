import React, { useState } from 'react';
import axios from 'axios';
import Write from '../utilities/Write';
import CommentError from './CommentError';

type EditModeProps = {
  setComments: React.Dispatch<React.SetStateAction<TComment[]>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  comment: TComment;
};

const wrapperStyle = `width: 100%;
height: 100%;
background-color: white;
display: flex;
flex-flow: column;
justify-content: space-between;
border-radius: 1rem;
padding: 1rem;`;

export default function CommentEdit({
  comment,
  setComments,
  setIsEdit,
}: EditModeProps) {
  const { id, content } = comment;
  const [editContent, setEditContent] = useState(content);
  const [isLoading, setIsLoading] = useState(false);
  const [onError, setOnError] = useState(false);

  const submitEditContent = async () => {
    try {
      setIsLoading(true);
      const result = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/comments`,
        { id, content: editContent },
        {
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken') ?? '',
          },
        }
      );

      const { content, is_edit } = result.data;
      setEditContent('');
      setComments((prevComments) => {
        return prevComments.map((comment) =>
          comment.id === id ? { ...comment, content, is_edit } : comment
        );
      });
      setIsEdit(false);
    } catch (error) {
      console.log(error);
      setOnError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const submitCancel = () => {
    setIsEdit(false);
  };

  return (
    <>
      {onError && <CommentError setOnError={setOnError} />}
      <Write
        commentToEdit={comment}
        wrapperStyle={wrapperStyle}
        submitCancel={submitCancel}
        submitContent={submitEditContent}
        onChangeContent={setEditContent}
        isLoading={isLoading}
      ></Write>
    </>
  );
}
