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
    margin-top: 43px;
    margin-bottom: 37px;
    font-weight: 400;
    font-size: 20px;
    /* background-color: yellowgreen; */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    line-height: 1;

    .re {
      position: relative;
      /* background-color: yellow; */
      width: 19%;
      height: 28px;
      .star {
        position: absolute;
        /* left: 10rem; */
        margin-right: 1.5rem;
        width: 150px;
        overflow: hidden;
      }
    }
    span {
      /* background-color: red; */
    }

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
  flex-direction: column;

  overflow-y: scroll;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  &::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }

  .pagination {
    /* background-color: aliceblue; */
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    button {
      width: 2rem;
      height: 2rem;
      margin: 0 0.5rem;
      /* border: 1px solid black; */
      border-radius: 0.5rem rem;
      font-size: 1.2rem;
    }
  }
`;

const ReviewTab = ({ festival, authState }) => {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();

  //console.log(searchParams.get('page'));

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
  // console.log(level);
  /*
  reviewTab이 렌더링이 되면 url에 있는 page parameter로 해당 page 상태 세팅
  useEffect로 현재 페이지에 맞는 offset넣어서 데이터 불러오기 
  
  
  */
  const fetchReviews = useCallback(async () => {
    // console.log('fetchReviews offset', offset);
    setIsLoading(true);
    if (festivalId) {
      try {
        let result = await axios.get(
          `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/review/${festivalId}`,
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
  }, [festivalId, offset]);
  /* totalReview : 18
  unit : 5
  pageLength : totalReview % unit === 0 ? totalReview/unit : parseInt(totalReview/unit) + 1  (나누어 떨어지면 그대로, 나누어떨어지지 않으면 +1)
  page : (현재 페이지)
  page    1  2  3  ~~ n
  offset  0  5  10 ~~ (n-1)*5 <- 페이지로부터 계산
  level  : page % 5 === 0 ? page / 5  : parseInt(page / 5) + 1
  
  
  limit(계속 5개)
  
  0. 1페이지에 5개 리뷰씩 5페이지씩 보여준다고 가정
  1. 처음 렌더링 되었을 때 
      a. 페이지 버튼
            총 리뷰의 개수를 통해 몇개의 페이지가 생성되는지 계산, 페이지 개수에 따라 몇개의 번들이 만들어지는지 계산 
         
            pageLength<5? Array(pageLength) : Array(5) 맵핑할 때 [1+5*(level -1), 2+5*(level -1), 3+5*(level -1), 4+5*(level -1), 5+5*(level -1)]
  
              총 리뷰 3개
              : 1페이지, 1번들 
              총 리뷰 6개
              : 2페이지, 1번들
              총 리뷰 57개
              : 11페이지, 3번들
  
        i. 2번들 이상일 때
        
            offset : 0, 5, 10, 15, 20,        25, 30, 35
            page   : 1, 2, 3,  4,  5 ,        6,  7,  8
  
            현재 page가 1, 6, 11 일때마다 페이지 버튼 바꿔야됨
                5n-4 (n>=1)
                (5*0)+1<= page <(5*1)+1 : 1,2,3,4,5 몫 : 0   => 1+(0*5) 2+(0*5) 3+(0*5) 4+(0*5) 5+(0*5) 
                (5*1)+1<= page <(5*2)+1 : 6,7,8,9,10 몫 : 1 =>  1+(1*5) 2+(1*5) 3+(1*5) 4+(1*5) 5+(1*5) 
  \
                1 < ~~~ < 5  
                5p-4          5p
                1,2,3,4,5 ==>     몫 : 0  => 1+(0*5) 2+(0*5) 3+(0*5) 4+(0*5) 5+(0*5) 
                6,7,8,9,10 ==>    몫 : 1  => 1+(1*5) 2+(1*5) 3+(1*5) 4+(1*5) 5+(1*5) 
                11,12,13,14,15 >  몫 : 2
                2페이지면
                0.2로만들고 
                parseInt(0.2) => 0
  
                해야할 것 : 7이 5와 10사이에 있는지 판단이 가능하면됨
  
                7페이지면 
                0.7로만들고
                parseInt(0.7) => 
  
                !10으로 나누어 소숫점을 만들어준 다음 반올림을 하고 여기에 다시 10을 곱해주어서 정수 반올림을 한다. 같은 방법으로 올림은 Math.ceil, 내림은 Math.floor을 하면 된다.
  
      b. 화살표 버튼
            < : 비활성화
            > : page<=5? 비활성화 : 활성화
  
  
  2. 각 nav버튼을 누를 때 
      특정 페이지의 다섯개의 리뷰를 불러오기 axios.get(limit=5, offset=)
      
  
      a. 페이지 버튼을 누를 때 
         ex) 2페이지면 axios.get(limit = 5, offset = (2-1)*5)
      b. 화살표 번호를 누를 때
         < 버튼 
            - axios.get(limit= 5, offset = ((page-2)*5)로 이동
            - page가 0이면 비활성화
  
         > 버튼
            - axios.get(limit= 5, offset = (page*5)로 이동
            - 마지막 page면 비활성화 (page === pageLength)
  
  */

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
          // console.log('before', listOfReviews);
          const nextReviewLists = reviews.filter(
            (review) => Number(review.id) !== Number(reviewId)
          );
          // console.log('after', nextReviewLists);
          setReviews(nextReviewLists);
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const goToPage = (navTo) => {
    // console.log(pageNum, 'gotoPage');

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
          <>리뷰가 등록되어있지 않습니다.</>
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
              {/*
              
                현재 레벨에서 5개 이하이면 5개 이하의 버튼을 보여줘야함

                총 페이지 7개
                레벨 2에선 페이지 2개

                pageLength - (level - 1) * unit < 5 이면

                현재 레벨에서 남은 개수만큼 렌더링

                level * unit

                [1,2,3,4,5]
                [6,7]

                unit(5)*(level-1) + 1 부터 시작해서 맵핑

              */}
              {pageLength - (level - 1) * unit < 5
                ? Array(pageLength - (level - 1) * unit)
                    .fill(0)
                    .map((ele, idx) => idx + 1 + unit * (level - 1))
                    .map((ele) => (
                      <button
                        style={{
                          color: `${ele === page ? `#FF9A62` : 'black'}`,
                          // fontSize: `${ele === page ? '2rem' : '1.5rem'}`,
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
                        // fontSize: `${ele === page ? '2rem' : '1.5rem'}`,
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
