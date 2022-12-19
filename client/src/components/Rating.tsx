import React, { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 10rem;
  height: 2.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;

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
type RatingProps = {
  handleRating: (rating: number) => void;
  initial: null | number;
  nowShowErrMsg: () => void;
};

const Rating = ({ handleRating, initial, nowShowErrMsg }: RatingProps) => {
  const [rating, setRating] = useState<number | null>(initial);
  const [hover, setHover] = useState<number | null>(null);
  const onClickRating = (rating: number) => {
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
              onClick={(e) => onClickRating(ratingValue)}
            />

            <AiFillStar
              className="star" // 각각 ratingValue : 1 2 3 4 5
              color={
                ratingValue <= ((hover as number) || (rating as number))
                  ? 'var(--mainColor)'
                  : 'lightgray'
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