import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../contexts/userContext';
import profileImg from '../../assets/profile.png';
import CountText from '../utilities/CountText';
import { mixin } from '../../styles/theme';
import Rating from '../utilities/Rating';
import Toast from '../utilities/Toast';
import { induceLogin, ModalContext } from '../../contexts/modalContext';

type WriteStyle = {
  Wrapper: string;
  CountText: string;
};

type WriteProps = {
  style?: WriteStyle;
  submitContent: () => Promise<void>;
  submitCancel?: () => void;
  onChangeContent?: (content: string) => void;
  isLoading?: boolean;
  // messages: Message[];
};

const Wrapper = styled.div`
  box-shadow: 0px 1px 0.2rem lightgrey;
  padding: 1rem;
  border-radius: 0.8rem;
  display: flex;
  flex-flow: column;
  background-color: white;
  width: 100%;

  .header {
    position: relative;
    .notifications {
      position: absolute;
      right: -1rem;
      top: -4rem;
    }
  }
  .body {
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
      max-width: 3rem;
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

  .footer {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .control {
      display: flex;
    }

    button {
      min-width: 3.5rem;
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
    .body {
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
    .body {
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
  style,
  submitCancel,
  submitContent,
  onChangeContent,
  isLoading,
}: // messages,
WriteProps) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  // const [content, setContent] = useState(() => {
  //   return commentToEdit ? commentToEdit.content : '';
  // });
  const [isEdit, setIsEdit] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const userContext = useContext(UserContext);
  const modalContext = useContext(ModalContext);

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

  const submitHandler = () => {
    if (!rating) createNotification('별점을 입력해 주세요');
    /**
     *
     * validation이 통과하면 props로 받아온 submitContent 전송
     */
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height =
        textareaRef.current?.scrollHeight + 'px';
      textareaRef.current.focus();
    }
  }, []);

  return (
    <Wrapper>
      <div className="header">
        <div className="notifications">
          {messages.map((message) => (
            <Toast key={message.uuid} message={message} />
          ))}
        </div>
      </div>
      <div className="body">
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
              setContent(e.target.value);
              setIsEdit(true);
              handleResizeHeight();
            }}
            disabled={isLoading || !userContext?.authState.loginStatus}
            maxLength={200}
            value={content}
          />
          <CountText content={content} maxContentLength={200} />
        </div>
      </div>
      <div className="footer">
        <Rating handleRating={ratingHandler} />

        <div className="control">
          <button className="write-cancel" onClick={submitCancel}>
            취소
          </button>
          {userContext?.authState.loginStatus && (
            <button
              ref={submitBtnRef}
              className={isLoading ? 'write-submit loading' : 'write-submit'}
              onClick={submitHandler}
              disabled={content.length === 0 || isLoading || !isEdit}
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
      </div>
    </Wrapper>
  );
}
