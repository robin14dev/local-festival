import axios from 'axios';
import React, { useState, useContext } from 'react';
import { ModalContext } from '../contexts/modalContext';
import styled, { css } from 'styled-components';
import Rating from './Rating';
import Toast from './Toast';
import cameraImg from '../assets/camera.png';
import { useRef } from 'react';

const Wrapper = styled.div<{ isEdit?: boolean }>`
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
  ${(props) =>
    props.isEdit &&
    css`
      border: none;
    `}

  @media screen and (max-width: 1076px) {
    width: 95%;
  }

  @media (max-width: 485px) {
    margin: 0 1rem;

    ${(props) =>
      props.isEdit &&
      css`
        margin: 0;
        width: 100%;
        border: 1px solid #d9d9d9;
        width: 100%;
      `}
  }

  @media (max-width: 375px) {
    ${(props) =>
      props.isEdit &&
      css`
        border: 1px solid #d9d9d9;
      `}
  }
`;

const Textarea = styled.textarea<{ length: number }>`
  width: 100%;
  height: 7rem;
  border: none;
  resize: none;
  border-radius: 8px 8px 0 0;
  padding: 1rem;
  transition: all 1s;

  & + .countText {
    height: 1.5rem;
    display: flex;
    align-items: center;
    display: flex;
    justify-content: space-evenly;
    width: 5.5rem;
    margin-left: 1rem;
    margin-bottom: 0.5rem;
    .count {
      width: 40%;
      text-align: center;
    }
    .max {
      width: 40%;
      text-align: end;
      color: gray;
    }
  }

  @media screen and (max-width: 730px) {
    height: ${(props) => props.length >= 150 && '9rem'};
  }
  @media screen and (max-width: 540px) {
    height: ${(props) => props.length >= 150 && '12rem'};
  }
  @media screen and (max-width: 420px) {
    height: ${(props) => props.length >= 150 && '13rem'};
  }
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

const Button = styled.button<{ photo?: boolean; back?: boolean }>`
  background-color: ${(props) =>
    props.photo ? 'white' : `var(--primaryPurple)`};
  border: ${(props) => (props.photo ? '1px solid #D9D9D9' : 'none')};
  border-radius: 4px;
  color: white;
  width: 4rem;
  height: 33px;

  font-weight: bold;
  font-size: 1rem;

  ${(props) =>
    props.back &&
    css`
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background-color: white;
      border: 1.5px solid #b7b9f8;
      border-radius: 4px;
      color: var(--primaryPurple);
      width: 3rem;
    `}

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
    font-size: 0.8rem;
    ${(props) =>
      props.back &&
      css`
        font-size: 0.8rem;
      `};
  }
`;

type ReviewWriteProps = {
  updateReviewList: (newReview: TReviewItem) => void;
  festivalId: number;
  authState: AuthState;
  editItem?: EditItem;
  setEditItem?: React.Dispatch<React.SetStateAction<EditItem>>;
  updateReview?: (updatedItem: TReviewItem) => void;
};
const ReviewWrite = ({
  updateReviewList,
  festivalId,
  authState,
  setEditItem,
  editItem,
  updateReview,
}: ReviewWriteProps) => {
  const modalContext = useContext(ModalContext);
  const [content, setContent] = useState(editItem?.info.content || '');
  const maxContentLength = useRef(301);
  const [rating, setRating] = useState<number | null>(
    editItem?.info.rating || null
  );
  type Message = {
    text: string;
    dismissTime: number;
    uuid: number;
  };
  const [messages, setMessages] = useState<Message[]>([]);

  const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
    setContent(e.target.value);
    if (e.target.value.length >= maxContentLength.current) {
      createNotification(
        `${maxContentLength.current - 1}자 까지 입력할 수 있습니다.`
      );
      setContent(e.target.value.slice(0, -1));
      return;
    }
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

  const handleSubmit = async () => {
    if (!rating && content.length === 0) {
      return createNotification('후기와 별점을 작성해 주세요');
    }
    if (!rating) {
      return createNotification('별점을 입력해 주세요');
    }
    if (content.length === 0) {
      return createNotification('후기를 작성해 주세요');
    }

    if (editItem) {
      console.log('수정타임');
      const updateSrc = {
        id: {
          review: editItem.info.id,
          festival: festivalId,
          user: editItem.info.userId,
        },
        content,
        rating,
      };
      try {
        let updated = await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/review`,
          updateSrc,
          {
            headers: {
              accesstoken: sessionStorage.getItem('accesstoken') ?? '',
            },
          }
        );
        console.log(updated.data);
        const updatedItem = updated.data[0];
        if (updateReview) {
          console.log('revewWrite');

          updateReview(updatedItem);
        }
        if (setEditItem) {
          setEditItem((prevEditItem) => ({
            ...prevEditItem,
            isEdit: false,
          }));
        }

        return;
      } catch (error) {}
    }
    console.log('실행되??');

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
          like_num: 0,
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
    <Wrapper isEdit={editItem?.isEdit}>
      <div className="notifications">
        {messages.map((message) => (
          <Toast key={message.uuid} message={message} />
        ))}
      </div>
      <Textarea
        length={content.length}
        spellCheck="false"
        maxLength={maxContentLength.current}
        value={content}
        onChange={handleContent}
        placeholder="후기를 남겨주세요."
      />
      <section className="countText">
        <span className="count">{content.length}</span>/
        <span className="max">{` ${maxContentLength.current - 1}`}</span>
      </section>
      <Controllers>
        <Rating initialRating={rating} handleRating={handleRating} />
        <div>
          <Button photo>
            <img src={cameraImg} alt="사진올리기"></img>
          </Button>
          {authState.loginStatus ? (
            editItem ? (
              <>
                <Button
                  back={true}
                  onClick={() => {
                    if (setEditItem) {
                      setEditItem((prev) => ({ ...prev, isEdit: false }));
                    }
                  }}
                >
                  취소
                </Button>
                <Button onClick={handleSubmit}>수정하기</Button>
              </>
            ) : (
              <Button onClick={handleSubmit}>올리기</Button>
            )
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
