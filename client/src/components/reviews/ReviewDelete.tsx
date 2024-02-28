import React, { useState } from "react";
import axios from "axios";
import Confirm from "../utilities/Confirm";

type ReviewDeleteProps = {
  review: TReviewItem;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  updateReviews: (
    type: "CREATE" | "UPDATE" | "DELETE",
    reviewItem: TReviewItem,
  ) => void;
};

export default function ReviewDelete({
  review,
  setIsDelete,
  updateReviews,
}: ReviewDeleteProps) {
  const deleteConfirmText = {
    alert: "리뷰를 정말 삭제하시겠습니까?",
    cancel: "취소",
    confirm: "삭제",
  };
  const [isLoading, setIsLoading] = useState(false);
  const [onError, setOnError] = useState(false);

  const deleteReview = async (review: TReviewItem) => {
    const { festivalId, id } = review;
    try {
      setIsLoading(true);
      await axios({
        method: "delete",
        url: `${process.env.REACT_APP_SERVER_URL}/review/${festivalId}/${id}`,
        headers: {
          accesstoken: sessionStorage.getItem("accesstoken") ?? "",
        },
      });
      updateReviews("DELETE", review);
    } catch (error) {
      setOnError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const onClickCancel = () => {
    setIsDelete(false);
  };
  const onErrorHandler = () => {
    setIsDelete(false);
  };

  return (
    <Confirm
      errorStatus={onError}
      onErrorFunc={onErrorHandler}
      loadingStatus={isLoading}
      text={deleteConfirmText}
      cancelHandler={onClickCancel}
      confirmHandler={() => deleteReview(review)}
    />
  );
}
