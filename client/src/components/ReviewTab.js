import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReviewWrite from './ReviewWrite';
import axios from 'axios';
import ReviewItem from './ReviewItem';
const Wrapper = styled.div`
  width: 100%;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  .totalRating {
    margin-top: 43px;
    margin-bottom: 37px;
    font-weight: 400;
    font-size: 20px;

    @media (max-width: 485px) {
      display: none;
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
    @media (max-width: 485px) {
      /* padding: 0; */
    }
  }
`;

const ReviewList = styled.section`
  margin: 1rem 0;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column-reverse;

  overflow-y: scroll;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  &::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`;

const ReviewTab = ({ festival, authState }) => {
  const { festivalId } = festival;

  const [listOfReviews, setListOfReviews] = useState([]);

  //* listOfReviews
  // {content: "'소록소록 로운 비나리 소록소록 다솜.',", createdAt: "20…}
  // id :1
  // festivalId : 3
  // userId : "bbb1234"
  // nickname :"유동혁"
  // content : "'소록소록 로운 비나리 소록소록 다솜.',"
  // rating:4
  // createdAt: "2022-06-14T01:44:00.000Z"
  // updatedAt: "2022-06-14T01:44:00.000Z"

  useEffect(() => {
    //# 특정 축제에 대한 리뷰글들을 불러온다.
    //* api 수정 특정 글의 리뷰로 전달
    console.log('review tab here------------');
    axios
      .get(
        `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/review/${festivalId}`,
        {
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken'),
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setListOfReviews(response.data);
        //console.log('reviewtab 클릭시 서버에서 리뷰리스트를 받아옵니다.');
      })
      .catch((err) => {
        console.log(err);
        // console.log('받아오는게 없어서 dummydata로 대체합니다.');
      });
  }, [festivalId]);

  const updateReviewList = (newReview) => {
    console.log('상끌 성공!!!!');

    const nextReviewLists = [...listOfReviews, newReview];

    setListOfReviews(nextReviewLists);
  };

  const deleteReview = (reviewId, festivalId) => {
    axios
      .delete(
        `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/review/${festivalId}/${reviewId}`,
        {
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken'),
          },
        }
      )
      .then((response) => {
        console.log(response.data.message);
        if (response.data.message === 'ok') {
          console.log('before', listOfReviews);
          const nextReviewLists = listOfReviews.filter(
            (review) => Number(review.id) !== Number(reviewId)
          );
          console.log('after', nextReviewLists);
          setListOfReviews(nextReviewLists);
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Wrapper>
      <div className="totalRating">총 별점 : 8.7</div>
      <h2>
        후기<span> 87</span>
      </h2>
      <ReviewWrite
        authState={authState}
        festivalId={festivalId}
        updateReviewList={updateReviewList}
      />
      <ReviewList>
        {!listOfReviews.length ? (
          <>리뷰가 등록되어있지 않습니다.</>
        ) : (
          <>
            {listOfReviews.map((review) => (
              <ReviewItem
                key={review.id}
                deleteReview={deleteReview}
                authState={authState}
                review={review}
              />
            ))}
          </>
        )}
      </ReviewList>
    </Wrapper>
  );
};

export default ReviewTab;
