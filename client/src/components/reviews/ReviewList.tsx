import React from 'react';
import styled from 'styled-components';
import ReviewItem from './ReviewItem';
import Loading, { Wrapper as W } from '../Loading';
import ServerFailModal from '../utilities/ServerFailModal';
import { ReactComponent as ServerFailIcon } from '../../assets/server-fail.svg';

type ReviewListProps = {
  isLoading: boolean;
  isError: boolean;
  onErrorHandler: () => void;
  reviews: TReviewItem[] | null;
  updateReviews: (
    type: 'CREATE' | 'UPDATE' | 'DELETE',
    reviewItem: TReviewItem
  ) => void;
};
const LoadingWrapper = styled(W)`
  margin-top: 0;
`;

const Container = styled.ul`
  width: 100%;
  margin-top: 2rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  .onError {
    display: flex;
    flex-flow: column;
    margin: 0 auto;
    align-items: center;
    font-weight: 400;
    /* box-shadow: 0 1px 3px lightgray; */
    border-radius: 1rem;
    padding: 1rem;

    svg {
      width: 40%;
      max-height: 3.5rem;
      & + p {
        margin-top: 1rem;
      }
    }

    p:nth-child(2) {
      font-weight: 500;
    }

    p + p {
      margin-top: 0.5rem;
    }
  }

  .noReview {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media screen and (max-width: 1076px) {
    padding: 0 1.5rem;
  }

  @media (max-width: 490px) {
    padding: 0 1rem;
  }
`;

export default function ReviewList({
  isLoading,
  isError,
  onErrorHandler,
  reviews,
  updateReviews,
}: ReviewListProps) {
  if (isLoading)
    return (
      <Container>
        <LoadingWrapper>
          <Loading text="리뷰를 불러오고 있습니다" />
        </LoadingWrapper>
      </Container>
    );

  if (isError)
    return (
      <Container>
        <ServerFailModal confirmError={onErrorHandler} />
        <div className="onError">
          <ServerFailIcon />
          <p>서버와의 연결이 끊어졌습니다</p>
          <p>연결 상태를 확인해 주세요</p>
        </div>
      </Container>
    );

  if (!reviews) return <Container></Container>;
  if (reviews.length === 0)
    return (
      <Container>
        <div className="noReview">리뷰가 등록되어있지 않습니다.</div>
      </Container>
    );

  return (
    <Container>
      {reviews.map((review: TReviewItem) => (
        <ReviewItem
          key={review.id}
          review={review}
          updateReviews={updateReviews}
        />
      ))}
    </Container>
  );
}
