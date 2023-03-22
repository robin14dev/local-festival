import React, { useState } from 'react';
import ReviewWrite from './ReviewWrite';
import axios from 'axios';
type ReviewEditProps = {
  review: TReviewItem;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  updateReviews: (
    type: 'CREATE' | 'UPDATE' | 'DELETE',
    reviewItem: TReviewItem
  ) => void;
};

export default function ReviewEdit({
  review,
  setIsEdit,
  updateReviews,
}: ReviewEditProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const submitCancel = () => {
    setIsEdit(false);
  };

  const updateReview = async (text: string, rateToSubmit: number) => {
    const updateSrc = {
      id: {
        review: review.id,
        festival: review.festivalId,
        user: review.userId,
      },
      content: text,
      rating: rateToSubmit,
    };
    try {
      setIsLoading(true);
      const updatedRes = await axios({
        method: 'put',
        url: `${process.env.REACT_APP_SERVER_URL}/review`,
        data: updateSrc,
        headers: {
          accesstoken: sessionStorage.getItem('accesstoken') ?? '',
        },
      });
      const updatedItem = updatedRes.data[0] as TReviewItem;
      updateReviews('UPDATE', updatedItem);
      setIsEdit(false);
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
      submitContent={updateReview}
      submitCancel={submitCancel}
      review={review}
    ></ReviewWrite>
  );
}
