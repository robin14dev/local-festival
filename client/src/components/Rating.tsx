import React, { useState, useEffect } from 'react';
import { AiFillStar } from 'react-icons/ai';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  width: 10rem;
  height: 2.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;

  & > label {
    width: 20%;
    svg {
      width: 100%;
      height: 100%;
    }
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
  initialRating?: number | null;
};

const Rating = ({ handleRating, initialRating }: RatingProps) => {
  const [hover, setHover] = useState<number | null>(null);
  const [click, setClick] = useState<number | null>(initialRating || 0);
  const onClickRating = (rating: number) => {
    setClick(rating);
    handleRating(rating);
  };
  useEffect(() => {
    if (initialRating === 0) {
      setClick(initialRating);
    }
  }, [initialRating]);
  return (
    <Wrapper>
      {[1, 2, 3, 4, 5].map((ele) => {
        return (
          <label key={ele}>
            <input
              type="radio"
              name="rating"
              value={ele}
              onClick={(e) => onClickRating(ele)}
            />

            <AiFillStar
              className="star" // 각각 ratingValue : 1 2 3 4 5
              color={
                ele <= ((hover as number) || (click as number))
                  ? 'var(--mainColor)'
                  : 'lightgray'
              }
              size={100}
              onMouseEnter={() => setHover(ele)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </Wrapper>
  );
};

export default Rating;
