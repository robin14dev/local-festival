import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { showRating } from './ReviewItem';
import ReviewCreate from './ReviewCreate';
import ReviewList from './ReviewList';
import Pagination from './Pagination';
import { useCallback } from 'react';

const Wrapper = styled.section`
  padding: 0 1rem;
  width: 100%;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  .totalRating {
    width: 100%;
    padding: 0 40%;
    margin-top: 43px;
    margin-bottom: 37px;
    font-weight: 400;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 1;

    .re {
      position: relative;
      width: 19%;
      height: 28px;
      .star {
        position: absolute;
        margin-right: 1.5rem;
        width: 150px;
        overflow: hidden;
      }
    }
  }

  h2 {
    align-self: flex-start;
    padding-left: 1rem;
    padding-bottom: 7px;

    span {
      font-weight: 300;
      font-size: 26px;
      line-height: 24px;

      color: #ff9a62;
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    button {
      width: 2rem;
      height: 2rem;
      margin: 0 0.5rem;
      border-radius: 0.5rem;
      font-size: 1.2rem;
    }
  }

  @media screen and (max-width: 1076px) {
    .totalRating {
      padding: 0 38%;
    }
  }
  @media screen and (max-width: 768px) {
    .totalRating {
      padding: 0 34%;
    }
  }
  @media screen and (max-width: 570px) {
    .totalRating {
      padding: 0 30%;
    }
  }

  @media (max-width: 485px) {
    .totalRating {
      display: none;
    }
  }
`;
type ReviewTabProps = {
  festivalId: number;
};

const ReviewTab = ({ festivalId }: ReviewTabProps) => {
  const [searchParams] = useSearchParams();

  const [reviews, setReviews] = useState<TReviewItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [average, setAverage] = useState(0);

  const [page, setPage] = useState(1);
  let reviewsCount = useRef(0);
  const unit = 5;
  let offset = useMemo(() => (page - 1) * unit, [page]);

  /*
  !리뷰탭(부모)에 있어야 할 것들 (필수)
  offset : fetchReview에서 사용해야됨
  page : offset에서 사용됨
  reviewsCount : fetchReview로 업데이트됨
  unit : offset 계산에 사용됨
  */

  // console.log(
  //   'searchParams',
  //   searchParams,
  //   'reviews',
  //   reviews,
  //   'isLoading',
  //   isLoading,
  //   'page',
  //   page
  // );

  /*
    @현재 페이지 번호를 클릭 => url 변경 => useEffect 호출 => setPage, fetchReviews
  
  */

  useEffect(() => {
    Number(searchParams.get('page'))
      ? setPage(Number(searchParams.get('page')))
      : setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const fetchReviews = async (festivalId: number, offset: number) => {
      setIsLoading(true);
      try {
        const reviewsRes = await axios({
          method: 'get',
          url: `${process.env.REACT_APP_SERVER_URL}/review/${festivalId}`,
          params: { limit: 5, offset },
        });

        const { count, rows, average } = reviewsRes.data;
        setReviews(rows);
        setAverage(average);

        reviewsCount.current = count;
      } catch (error) {
        console.log(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews(festivalId, offset);
  }, [offset, festivalId]);

  const updateReviews = (
    type: 'CREATE' | 'UPDATE' | 'DELETE',
    reviewItem: TReviewItem
  ) => {
    switch (type) {
      case 'CREATE':
        return setReviews(
          (prevReviews) => prevReviews && [reviewItem, ...prevReviews]
        );
      case 'UPDATE':
        return setReviews(
          (prevReviews) =>
            prevReviews &&
            prevReviews.map((prevItem) =>
              prevItem.id !== reviewItem.id ? prevItem : reviewItem
            )
        );
      case 'DELETE':
        return setReviews(
          (prevReviews) =>
            prevReviews &&
            prevReviews.filter((prevItem) => prevItem.id !== reviewItem.id)
        );
      default:
        break;
    }
  };

  const onErrorHandler = useCallback(() => {
    setIsError(false);
  }, []);

  return (
    <Wrapper>
      <article className="totalRating">
        <div className="re">
          <div className="star"> {showRating(0, 30)}</div>
          <div
            className="star"
            style={{
              width: `${(average / 5) * 150}px`,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {showRating(5, 30)}
          </div>
        </div>
        <span>{average.toFixed(1)}</span>
      </article>
      <h2>
        후기<span> {reviewsCount.current}</span>
      </h2>
      <ReviewCreate festivalId={festivalId} updateReviews={updateReviews} />
      <ReviewList
        isLoading={isLoading}
        isError={isError}
        onErrorHandler={onErrorHandler}
        reviews={reviews}
        updateReviews={updateReviews}
      />

      {reviews && reviews.length !== 0 && (
        <Pagination
          page={page}
          reviewsCount={reviewsCount.current}
          unit={unit}
        />
      )}
    </Wrapper>
  );
};

export default ReviewTab;
