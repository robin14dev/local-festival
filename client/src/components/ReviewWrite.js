import axios from 'axios';
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Rating from './Rating';

const Wrapper = styled.div`
  width: 96%;
  height: 14rem;

  border-radius: 0.5rem;
  overflow-y: auto;
  padding: 0.5rem;
  margin: 1rem;
  box-shadow: 0.1rem 0.1rem 0.3rem gray; ;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 6rem;
  border: none;
  resize: none;
  margin-top: 1rem;
  border-radius: 0.3rem;
  padding: 1rem;
  background-color: #efefefcf;
`;
const Controllers = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
`;
const Button = styled.button`
  background-color: var(--primaryBlue);
  color: white;
  width: 4rem;
  height: 2.5rem;
  border-radius: 0.3rem;
  font-weight: bold;
  font-size: 1rem;
  /* padding: 0.5rem; */

  cursor: pointer;
  outline: inherit;
  transition: transform 0.2s ease-out;
  &:hover {
    transition: transform 0.2s ease-out;
    transform: translateY(-5%);
  }
  &:active {
    color: #6cf7a6;
  }
`;

const ErrorMessage = styled.div`
  width: 60%;
  color: red;
  /* position: relative; */
  /* left: 9rem; */
  /* background-color: yellow; */
  text-align: right;
  line-height: 2.4;
  font-size: large;
  font-weight: bold;
`;
const ReviewWrite = ({ updateReviewList, festivalId, authState }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(null);

  const errorMessage = useRef();

  const handleContent = (e) => {
    console.log(e.target.value);
    setContent(e.target.value);
  };

  const handleRating = (rating) => {
    // 올려와진 값으로 setRating
    setRating(rating);
  };

  const nowShowErrMsg = () => {
    errorMessage.current.textContent = '';
  };

  // ReviewWrite : handleRating > <Rating howmany={rating} handleRating={handleRating} />

  const handleSubmit = () => {
    if (!rating) {
      console.log(errorMessage.current);
      errorMessage.current.textContent = '별점을 입력해 주세요';
    } else if (content.length === 0) {
      console.log(errorMessage.current);
      errorMessage.current.textContent = '내용을 입력해 주세요';
    } else {
      axios
        .post(
          `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/review`,
          {
            data: {
              content: content,
              rating: Number(rating),
              festivalId: festivalId,
            },
          },
          {
            headers: {
              accesstoken: sessionStorage.getItem('accesstoken'),
            },
          }
        )
        .then((response) => {
          console.log(
            'axios 보낸다음에 일시적으로 update하기 !! response???',
            response
          );

          const {
            content,
            createdAt,
            festivalId,
            id,
            rating,
            updatedAt,
            userId,
          } = response.data;
          //#작성한 리뷰 ReviewList에 올려지도록 하기
          const newReview = {
            userId,
            content,
            rating,
            createdAt,
            updatedAt,
            festivalId,
            id,
            User: {
              nickname: authState.nickname,
            },
          };
          // updateReviewList({userId : authState.userId, nickname: authState.nickname, content : content, rating : rating, createdAt:(new Date()).toLocaleString()})
          updateReviewList(newReview);
          setRating(0);
          setContent('');
          errorMessage.current.textContent = '';
          // window.scrollTo({top:0, behavior:'smooth'})
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <Wrapper>
      <h2>리뷰</h2>

      <Textarea
        onMouseDown={nowShowErrMsg}
        value={content}
        onChange={handleContent}
        placeholder="후기를 남겨주세요."
      ></Textarea>
      <Controllers>
        <Rating
          nowShowErrMsg={nowShowErrMsg}
          initial={rating}
          handleRating={handleRating}
        />
        <ErrorMessage ref={errorMessage} />
        <Button onClick={handleSubmit}>올리기</Button>
      </Controllers>
    </Wrapper>
  );
};

export default ReviewWrite;
