import axios from 'axios';
import React, { useState } from 'react';
import ReviewWrite from './ReviewWrite';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../contexts/userContext';

type ReviewCreateProps = {
  festivalId: number;

  updateReviews: (
    type: 'CREATE' | 'UPDATE' | 'DELETE',
    reviewItem: TReviewItem
  ) => void;
};
const ReviewCreate = ({ updateReviews, festivalId }: ReviewCreateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const createReview = async (text: string, rateToSubmit: number) => {
    try {
      setIsLoading(true);
      const createdRes = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_SERVER_URL}/review`,
        data: {
          content: text,
          rating: Number(rateToSubmit),
          festivalId: festivalId,
        },
        headers: {
          accesstoken: sessionStorage.getItem('accesstoken') ?? '',
        },
      });
      const { content, createdAt, id, rating, updatedAt, userId } =
        createdRes.data;
      const newReview = {
        userId,
        content,
        rating,
        createdAt,
        updatedAt,
        festivalId,
        id,
        User: {
          nickname: userContext?.authState.nickname as string,
          defaultPic: userContext?.authState.defaultPic as string,
        },
        like_num: 0,
      };
      updateReviews('CREATE', newReview);
      navigate('.?page=1');
      return 'SUCCESS';
    } catch (error) {
      setIsError(true);
      return 'FAILURE';
    } finally {
      setIsLoading(false);
    }
  };

  const onErrorHandler = () => {
    setIsError(false);
  };

  return (
    <ReviewWrite
      isLoading={isLoading}
      errorStatus={isError}
      onErrorFunc={onErrorHandler}
      submitContent={createReview}
    ></ReviewWrite>
  );
};

export default ReviewCreate;
