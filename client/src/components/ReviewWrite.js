import axios from 'axios';
import React, { useState, useRef, useContext } from 'react';
import { ModalContext } from '../contexts/modalContext';
import styled from 'styled-components';
import Rating from './Rating';
import cameraImg from '../assets/camera.png';

const Wrapper = styled.div`
  width: 100%;
  height: auto;

  border: 1px solid #d9d9d9;
  border-radius: 8px;

  @media screen and (max-width: 1076px) {
    width: 95%;
  }

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (max-width: 485px) {
    max-width: 400px;
    margin: 0 1rem;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 131px;
  border: none;
  resize: none;
  border-radius: 8px 8px 0 0;
  padding: 1rem;
`;
const Controllers = styled.div`
  height: 57px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  border-top: 1px solid #d9d9d9;
  border-radius: 0px 0px 0.5rem 0.5rem;
`;
const Button = styled.button`
  background: ${(props) => (props.photo ? 'white' : `var(--primaryPurple)`)};
  border: ${(props) => (props.photo ? '1px solid #D9D9D9' : 'none')};
  border-radius: 4px;
  color: white;
  width: 72.07px;
  height: 33px;

  font-weight: bold;
  font-size: 1rem;

  img {
    height: 24px;
    margin-top: 4px;
  }

  cursor: pointer;
  outline: inherit;
  transition: transform 0.2s ease-out;
  &:hover {
    transition: transform 0.2s ease-out;
    transform: translateY(-5%);
  }

  & + & {
    margin-left: 1rem;
  }

  @media (max-width: 485px) {
    /* width: 81px; */
    font-size: 0.8rem;
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
  padding-right: 1rem;

  @media screen and (max-width: 485px) {
    font-size: 12px;
  }
`;
const ReviewWrite = ({ updateReviewList, festivalId, authState }) => {
  const { setLoginModal } = useContext(ModalContext);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(null);
  // console.log(authState);
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
          `${process.env.REACT_APP_SERVER_URL}/review`,
          {
            content: content,
            rating: Number(rating),
            festivalId: festivalId,
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
        <Button photo>
          <img src={cameraImg} alt="사진올리기"></img>
        </Button>
        {authState.loginStatus ? (
          <Button onClick={handleSubmit}>올리기</Button>
        ) : (
          <Button
            onClick={() => {
              setLoginModal(true);
            }}
          >
            로그인
          </Button>
        )}
      </Controllers>
    </Wrapper>
  );
};

export default ReviewWrite;
