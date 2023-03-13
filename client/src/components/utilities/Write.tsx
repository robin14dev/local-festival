import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../contexts/userContext';
import profileImg from '../../assets/profile.png';
import CountText from './CountText';
import { mixin } from '../../styles/theme';

type WriteProps = {
  commentToEdit?: TComment;
  commentToReply?: TComment;
  submitContent: () => Promise<void>;
  submitCancel: () => void;
  onChangeContent: (content: string) => void;
  isLoading: boolean;
  wrapperStyle: string;
};

const wrapperFunc = (whole: string) => {
  if (whole === 'default') {
    return `
        box-shadow: 0px 1px 0.2rem lightgrey;
        padding: 1rem;
        border-radius: 0.8rem;
        display: flex;
        flex-flow: column;
        background-color: white;
        margin: 0.5rem 0 0.5rem 3.5rem;
        max-width: 50rem;`;
  } else {
    return whole;
  }
};
const Wrapper = styled.div<{ wrapperStyle: string }>`
  ${(props) => wrapperFunc(props.wrapperStyle)}

  .body {
    display: flex;
    align-items: center;
    transition: all 1s;
    margin-bottom: 1rem;

    .text {
      display: flex;
      flex: 1;
      background-color: #eeeeeeb0;
      border-radius: 0.8rem;
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
    textarea {
      transition: all 1s;
      flex: 1;
      background-color: transparent;
      margin: 1rem;
      overflow: hidden;
    }
  }

  .footer {
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

export default function Write({
  wrapperStyle,
  commentToEdit,
  commentToReply,
  submitCancel,
  submitContent,
  onChangeContent,
  isLoading,
}: WriteProps) {
  const [content, setContent] = useState(() => {
    return commentToEdit ? commentToEdit.content : '';
  });
  const [isEdit, setIsEdit] = useState(false);
  const userContext = useContext(UserContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current?.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height =
        textareaRef.current?.scrollHeight + 'px';
      textareaRef.current.focus();
    }
  }, []);

  // const autoResize: () => undefined = () => {
  //   if (textareaRef.current) {
  //     textareaRef.current.style.height = 'auto';
  //     textareaRef.current.style.height =
  //       textareaRef.current.scrollHeight + 'px';
  //     return undefined;
  //   }
  //   return undefined;
  // };

  return (
    <Wrapper wrapperStyle={wrapperStyle}>
      <div className="body">
        {userContext?.authState.defaultPic ? (
          <img src={userContext?.authState.defaultPic} alt="프로필사진" />
        ) : (
          <img src={profileImg} alt="프로필사진" />
        )}
        <div className="text">
          {commentToEdit?.parent_nickname && (
            <div className="user-parent">
              <span>@{commentToEdit?.parent_nickname}</span>
            </div>
          )}
          {commentToReply?.User.nickname && (
            <div className="user-parent">
              <span>@{commentToReply?.User.nickname}</span>
            </div>
          )}
          <textarea
            ref={textareaRef}
            placeholder="여기에 작성해 주세요"
            spellCheck="false"
            // onResize={autoResize()}
            onChange={(e) => {
              setContent(e.target.value);
              setIsEdit(true);
              handleResizeHeight();
              onChangeContent(e.target.value);
            }}
            disabled={isLoading}
            maxLength={200}
            value={content}
          />
        </div>
      </div>
      <div className="footer">
        {<CountText content={content} maxContentLength={200} />}

        <div className="control">
          <button className="write-cancel" onClick={submitCancel}>
            취소
          </button>
          <button
            ref={submitBtnRef}
            className={isLoading ? 'write-submit loading' : 'write-submit'}
            onClick={submitContent}
            disabled={content.length === 0 || isLoading || !isEdit}
          >
            {!isLoading && '답글'}
          </button>
        </div>
      </div>
    </Wrapper>
  );
}
