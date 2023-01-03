import axios from 'axios';
import React, { useState, useRef, useContext } from 'react';
import { ModalContext } from '../contexts/modalContext';
import styled from 'styled-components';
import Rating from './Rating';
import Toast from './Toast';
import cameraImg from '../assets/camera.png';

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  position: relative;
  .notifications {
    position: absolute;
    top: -3rem;
    right: 0rem;
  }
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
  height: 3.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  border-top: 1px solid #d9d9d9;
  border-radius: 0px 0px 0.5rem 0.5rem;

  & > div {
    display: flex;
  }

  @media (max-width: 540px) {
  }
  @media (max-width: 485px) {
    padding: 0 0.5rem;
  }
  @media (max-width: 375px) {
    padding-left: 0;
  }
`;

const Button = styled.button<{ photo?: boolean }>`
  background: ${(props) => (props.photo ? 'white' : `var(--primaryPurple)`)};
  border: ${(props) => (props.photo ? '1px solid #D9D9D9' : 'none')};
  border-radius: 4px;
  color: white;
  width: 4rem;
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
    width: 4rem;
    /* font-size: 0.8rem; */
  }
  @media (max-width: 375px) {
    width: 3rem;
    /* font-size: 0.8rem; */
  }
`;

type ReviewWriteProps = {
  updateReviewList: (newReview: TReviewItem) => void;
  festivalId: number;
  authState: AuthState;
};
const ReviewWrite = ({
  updateReviewList,
  festivalId,
  authState,
}: ReviewWriteProps) => {
  const modalContext = useContext(ModalContext);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  type Message = {
    text: string;
    dismissTime: number;
    uuid: number;
  };
  const [messages, setMessages] = useState<Message[]>([]);

  const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
    setContent(e.target.value);
  };

  const handleRating = (rating: number) => {
    setRating(rating);
  };

  const createNotification = (text: string): void => {
    const newMessage: Message = {
      text,
      dismissTime: 2000,
      uuid: Math.random(),
    };
    /*
    두번클릭해서 똑같은 알람 뜨지 않게
    */
    if (messages[messages.length - 1]?.text === newMessage.text) return;

    setMessages((prevMessage) => [...prevMessage, newMessage]);
    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.slice(1));
    }, 2000);
  };

  const handleSubmit = () => {
    if (!rating && content.length === 0) {
      return createNotification('후기와 별점을 작성해 주세요');
    }
    if (!rating) {
      return createNotification('별점을 입력해 주세요');
    }
    if (content.length === 0) {
      return createNotification('후기를 작성해 주세요');
    }

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
            accesstoken: sessionStorage.getItem('accesstoken') ?? '',
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
        updateReviewList(newReview);
        setRating(0);
        setContent('');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Wrapper>
      <div className="notifications">
        {messages.map((message) => (
          <Toast key={message.uuid} message={message} />
        ))}
      </div>
      <Textarea
        value={content}
        onChange={handleContent}
        placeholder="후기를 남겨주세요."
      ></Textarea>
      <Controllers>
        <Rating initial={rating} handleRating={handleRating} />

        <div>
          <Button photo>
            <img src={cameraImg} alt="사진올리기"></img>
          </Button>
          {authState.loginStatus ? (
            <Button onClick={handleSubmit}>올리기</Button>
          ) : (
            <Button
              onClick={() => {
                if (modalContext) {
                  modalContext.setLoginModal(true);
                }
              }}
            >
              로그인
            </Button>
          )}
        </div>
      </Controllers>
    </Wrapper>
  );
};

export default ReviewWrite;
