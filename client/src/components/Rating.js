import React, { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 10rem;
  height: 2.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  /* background-color: white;
  box-shadow: 0 0.1rem 0.2rem 0.05rem lightgray; */

  & * {
    width: 20%;
    height: 100%;
  }
  & input[type='radio'] {
    display: none;
  }

  & .star {
    cursor: pointer;
    transition: color 200ms;
  }
`;

const Rating = ({ handleRating, initial, nowShowErrMsg }) => {
  const [rating, setRating] = useState(initial);
  const [hover, setHover] = useState(null);
  const onClickRating = (rating) => {
    nowShowErrMsg();
    setRating(rating);
    console.log(rating);
    console.log('상끌 rating ReviewWrite로 rating값 올려주기 ', rating);
    handleRating(rating);
  };

  useEffect(() => {
    setRating(initial);
  });

  return (
    <Wrapper>
      {[1, 2, 3, 4, 5].map((ele) => {
        const ratingValue = ele;

        return (
          <label key={ele}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={(e) => onClickRating(e.target.value)}
            />

            <AiFillStar
              className="star" // 각각 ratingValue : 1 2 3 4 5
              color={
                ratingValue <= (hover || rating)
                  ? 'var(--mainColor)'
                  : '#cdd9f6'
              }
              // ele={ele}
              // hover={hover}
              // rating={rating}
              //2. 각각의 ratingValue가 갖다댄값 hover보다 크면 회색
              //3 클릭햇을 때 rating값이 생기므로 hover가 null이어도 고정 더 큰값을 하면 일단 hover값이 있으니 rating까지 가지않고 hover에서 끊김
              size={100}
              onMouseEnter={() => setHover(ratingValue)} //1. 갖다대면 hover가 ratingValue로 바뀜
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </Wrapper>
  );
};

export default Rating;
