import React, { useState } from 'react';
import ReviewWrite from './ReviewWrite';
import axios from 'axios';
type ReviewEditProps = {
  review: TReviewItem;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  updateReview: (updatedItem: TReviewItem) => void;
};

export default function ReviewEdit({
  review,
  setIsEdit,
  updateReview,
}: ReviewEditProps) {
  const [isLoading, setIsLoading] = useState(false);

  const submitCancel = () => {
    setIsEdit(false);
  };

  const submitContent = async (text: string, rateToSubmit: number) => {
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

      updateReview(updatedItem);
      setIsEdit(false);
      return 'success';
    } catch (error) {
      return 'failure';
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ReviewWrite
      submitCancel={submitCancel}
      submitContent={submitContent}
      isLoading={isLoading}
      review={review}
    ></ReviewWrite>
  );
}
