import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { mixin } from '../../styles/theme';
import { UserContext } from '../../contexts/userContext';
import { induceLogin, ModalContext } from '../../contexts/modalContext';
import profileImg from '../../assets/profile.png';
import CountText from '../utilities/CountText';
import Rating from '../utilities/Rating';
import Toast from '../utilities/Toast';
import ServerFailModal from '../utilities/ServerFailModal';

type WriteStyle = {
  Wrapper: string;
  CountText: string;
};

type WriteProps = {
  style?: WriteStyle;
  submitContent: (
    text: string,
    rating: number
  ) => Promise<'SUCCESS' | 'FAILURE'>;
  submitCancel?: () => void;
  isLoading?: boolean;
  errorStatus: boolean;
  onErrorFunc: () => void;
  review?: TReviewItem;
};

const Wrapper = styled.article`
  box-shadow: 0px 1px 0.2rem lightgrey;
  padding: 1rem;
  padding-bottom: 0.8rem;
  padding-top: 1.3rem;
  border-radius: 1.5rem;
  display: flex;
  flex-flow: column;
  background-color: white;
  width: 100%;

  header {
    position: relative;
    .notifications {
      position: absolute;
      right: -1rem;
      top: -4rem;
    }
  }
  main {
    display: flex;
    align-items: center;
    transition: all 1s;
    margin-bottom: 1rem;

    .text {
      display: flex;
      flex-flow: column;
      flex: 1;
      background-color: #eeeeeeb0;
      border-radius: 0.8rem;

      textarea {
        transition: all 1s;
        flex: 1 1 auto;
        background-color: transparent;
        margin: 1rem;
        overflow: hidden;
        position: relative;
      }

      section {
        margin-left: auto;
        margin-right: 1rem;
        margin-bottom: 0.5rem;
      }
    }

    img {
      max-width: 3.5rem;
      border-radius: 50%;
      margin-right: 0.9rem;
    }
    .user-parent {
      border-radius: 1rem;
      margin-left: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        background-color: white;
        color: var(--primaryOrange);
        font-weight: 600;
        padding: 0.45rem;
        border-radius: 0.5rem;
        box-shadow: 0 0 2px var(--primaryOrange);
      }
    }
  }

  footer {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > div:nth-child(1) {
      margin-left: 3.5rem;
      width: 9.5rem;
    }

    .control {
      display: flex;
      min-height: 2.1rem;
    }

    button {
      min-width: 4rem;
      color: white;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.3s;
      padding: 0.5rem 0.8rem;
      background-color: var(--primaryOrange);
      border-radius: 0.9rem;
      :hover:enabled {
        filter: brightness(95%);
      }
      :disabled {
        background-color: lightgray;
      }

      & + button {
        margin-left: 0.5rem;
      }
    }

    .write-cancel {
      color: black;
      background-color: white;
    }

    .write-submit {
      :hover:enabled {
        filter: brightness(103%);
        box-shadow: 0px 1px 5px lightgray;
      }
    }

    .write-submit.loading {
      position: relative;
      background: rgb(255 154 98 / 35%);

      &::after {
        ${mixin.spinner('4px solid antiquewhite', `var(--primaryOrange)`)}
      }
    }
  }

  @media screen and (max-width: 639px) {
    main {
      .text {
        flex-flow: column;
        align-items: flex-start;
        padding: 1rem;
        .user-parent {
          margin-left: 0;
        }
        textarea {
          margin-top: 0.5rem;
          margin-left: 0px;
          width: 100%;
          flex: 1 1 auto;
        }
      }
    }
  }

  @media screen and (max-width: 425px) {
    padding: 1rem 0.5rem;
    main {
      flex-flow: column;

      img {
        align-self: start;
        margin-bottom: 1rem;
        position: relative;
      }

      .text {
        width: 100%;

        .user-parent {
          position: absolute;
          top: 2.1rem;
          left: 4.7rem;
        }
      }
    }
  }
`;
export default function ReviewWrite({
  submitCancel,
  submitContent,
  isLoading,
  errorStatus,
  onErrorFunc,
  review,
}: WriteProps) {
  const [text, setText] = useState(review ? review.content : '');
  const [rating, setRating] = useState(review ? review.rating : 0);

  const [isEdit, setIsEdit] = useState(false);
  const [isError, setIsError] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const userContext = useContext(UserContext);
  const modalContext = useContext(ModalContext);
  const maxText = 300;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      console.log('Resize');

      textareaRef.current.style.height = 'auto';
      console.log(textareaRef.current.scrollHeight);

      textareaRef.current.style.height =
        textareaRef.current?.scrollHeight + 'px';
    }
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

  const ratingHandler = (rating: number) => {
    setRating(rating);
  };

  const submitHandler = async () => {
    if (!rating) return createNotification('별점을 입력해 주세요');
    const result = await submitContent(text, rating);

    if (result === 'SUCCESS') {
      setText('');
      setRating(0);
    }
  };

  const onErrorHandler = () => {
    onErrorFunc();
    setIsError(false);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height =
        textareaRef.current?.scrollHeight + 'px';
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setIsError(errorStatus);
  }, [errorStatus]);

  return (
    <>
      {isError && (
        <ServerFailModal confirmError={onErrorHandler}></ServerFailModal>
      )}
      <Wrapper>
        <header>
          <div className="notifications">
            {messages.map((message) => (
              <Toast key={message.uuid} message={message} />
            ))}
          </div>
        </header>
        <main>
          {userContext?.authState.defaultPic ? (
            <img src={userContext?.authState.defaultPic} alt="프로필사진" />
          ) : (
            <img src={profileImg} alt="프로필사진" />
          )}
          <div className="text">
            <textarea
              ref={textareaRef}
              placeholder="여기에 작성해 주세요"
              spellCheck="false"
              onChange={(e) => {
                setText(e.target.value);
                setIsEdit(true);
                handleResizeHeight();
              }}
              disabled={isLoading || !userContext?.authState.loginStatus}
              maxLength={maxText}
              value={text}
            />
            <CountText content={text} maxContentLength={maxText} />
          </div>
        </main>
        <footer>
          <Rating initialRating={rating} handleRating={ratingHandler} />
          <div className="control">
            {review && (
              <button className="write-cancel" onClick={submitCancel}>
                취소
              </button>
            )}
            {userContext?.authState.loginStatus && (
              <button
                ref={submitBtnRef}
                className={isLoading ? 'write-submit loading' : 'write-submit'}
                onClick={submitHandler}
                disabled={text.length === 0 || isLoading || !isEdit}
              >
                {!isLoading && '올리기'}
              </button>
            )}
            {!userContext?.authState.loginStatus && (
              <button
                onClick={() => {
                  induceLogin(modalContext);
                }}
              >
                로그인
              </button>
            )}
          </div>
        </footer>
      </Wrapper>
    </>
  );
}
