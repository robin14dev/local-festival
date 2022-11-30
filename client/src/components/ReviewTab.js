import React, { useState, useEffect, forwardRef } from 'react';
import styled from 'styled-components';
import ReviewWrite from './ReviewWrite';
import axios from 'axios';
import ReviewItem from './ReviewItem';
import { useCallback } from 'react';
import { useRef } from 'react';
import loadImg from '../assets/loading.gif';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { showRating } from './ReviewItem';
const Wrapper = styled.div`
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

const ReviewList = styled.section`
  width: 100%;
  margin: 4rem 0;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;

  overflow-y: scroll;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  &::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }

  .noReview {
    display: flex;
    justify-content: center;
    align-items: center;
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
`;

const ReviewTab = ({ festival, authState }) => {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { festivalId } = festival;
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [average, setAverage] = useState(0);
  let reviewsCount = useRef(0);
  const unit = 5;
  const pageLength = reviewsCount.current
    ? reviewsCount.current % unit === 0
      ? reviewsCount.current / unit
      : parseInt(reviewsCount.current / unit) + 1
    : undefined;

  let offset = (page - 1) * unit;
  let level = page % 5 === 0 ? page / 5 : parseInt(page / 5) + 1;

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    if (festivalId) {
      try {
        let result = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/review/${festivalId}`,
          {
            headers: {
              accesstoken: sessionStorage.getItem('accesstoken'),
            },
            params: { limit: 5, offset },
          }
        );

        const { count, rows, average } = result.data;
        setReviews(rows);
        setAverage(average);
        reviewsCount.current = count;
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    console.log('reviews', reviews);
  }, [festivalId, offset]);

  useEffect(() => {
    //# 특정 축제에 대한 리뷰글들을 불러온다.
    //* api 수정 특정 글의 리뷰로 전달

    Number(searchParams.get('page'))
      ? setPage(Number(searchParams.get('page')))
      : setPage(1);
    fetchReviews();
  }, [fetchReviews, searchParams]);

  const updateReviewList = (newReview) => {
    console.log('상끌 성공!!!!');
    console.log(newReview);
    setReviews((prevReviews) => {
      if (prevReviews.length < 5) {
        return [newReview, ...prevReviews];
      } else {
        return [newReview, ...prevReviews.slice(0, -1)];
      }
    });
    reviewsCount.current++;
  };

  const deleteReview = (reviewId, festivalId) => {
    axios
      .delete(
        `${process.env.REACT_APP_SERVER_URL}/review/${festivalId}/${reviewId}`,
        {
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken'),
          },
        }
      )
      .then((response) => {
        console.log(response.data.message);
        if (response.data.message === 'ok') {
          const nextReviewLists = reviews.filter(
            (review) => Number(review.id) !== Number(reviewId)
          );
          setReviews(nextReviewLists);
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const goToPage = (navTo) => {
    if (navTo === '<') {
      navigate(`.?page=${page - 1}`);
    } else if (navTo === '>') {
      navigate(`.?page=${page + 1}`);
    } else {
      navigate(`.?page=${navTo}`);
    }
  };
  return (
    <Wrapper>
      <div className="totalRating">
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
        <span>{average}</span>
      </div>
      <h2>
        후기<span> {reviewsCount.current}</span>
      </h2>
      <ReviewWrite
        authState={authState}
        festivalId={festivalId}
        updateReviewList={updateReviewList}
      />
      <ReviewList>
        {isLoading && (
          <div>
            리뷰를 불러오고 있습니다
            <img src={loadImg} alt="loading"></img>
          </div>
        )}
        {reviews.length === 0 ? (
          <div className="noReview">리뷰가 등록되어있지 않습니다.</div>
        ) : (
          <>
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                deleteReview={deleteReview}
                authState={authState}
                review={review}
              />
            ))}

            <section className="pagination">
              <button
                disabled={page === 1}
                onClick={(e) => goToPage(e.target.textContent)}
              >
                &lt;
              </button>

              {pageLength - (level - 1) * unit < 5
                ? Array(pageLength - (level - 1) * unit)
                    .fill(0)
                    .map((ele, idx) => idx + 1 + unit * (level - 1))
                    .map((ele) => (
                      <button
                        style={{
                          color: `${ele === page ? `#FF9A62` : 'black'}`,
                          fontWeight: `${ele === page ? 'bold' : 'normal'}`,
                        }}
                        onClick={() => goToPage(ele)}
                        key={ele}
                      >
                        {ele}
                      </button>
                    ))
                : [
                    1 + 5 * (level - 1),
                    2 + 5 * (level - 1),
                    3 + 5 * (level - 1),
                    4 + 5 * (level - 1),
                    5 + 5 * (level - 1),
                  ].map((ele) => (
                    <button
                      style={{
                        color: `${ele === page ? '#FF9A62' : 'black'}`,
                        fontWeight: `${ele === page ? 'bold' : 'normal'}`,
                      }}
                      onClick={() => goToPage(ele)}
                      key={ele}
                    >
                      {ele}
                    </button>
                  ))}
              <button
                disabled={page === pageLength}
                onClick={(e) => goToPage(e.target.textContent)}
              >
                &gt;
              </button>
            </section>
          </>
        )}
      </ReviewList>
    </Wrapper>
  );
};

export default ReviewTab;
