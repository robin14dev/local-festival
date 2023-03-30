import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import axios, { AxiosError } from 'axios';

import Modal from '../utilities/Modal';
import ServerFailModal from '../utilities/ServerFailModal';
import { mixin } from '../../styles/theme';
import { ReactComponent as Auth } from '../../assets/auth.svg';
import { ReactComponent as Confirm } from '../../assets/confirm.svg';
import { ReactComponent as Invalid } from '../../assets/cancel.svg';
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;

  svg {
    color: var(--pri);
    margin-top: 2rem;
  }
  h1 {
    font-size: 100%;
    margin-top: 3rem;
  }

  input {
    width: 90%;
    padding: 0.8rem;
    border: 1px solid lightgray;
    border-radius: 0.8rem;
    margin-top: 1rem;
  }

  .err-message {
    width: 90%;
    height: 1rem;
    margin-top: 0.5rem;
    padding-left: 0.6rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #ff0047;

    display: flex;
    align-items: center;

    svg {
      height: 100%;
      margin: 0;
      margin-bottom: 2px;

      path {
        fill: #ff0047;
      }
    }
  }

  .controller {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;

    button {
      font-size: 1rem;
      font-weight: 500;
      color: var(--lightBlack);
      padding: 0.5rem 1rem;
      border-radius: 0.7rem;
      transition: all 0.3s;
      &:disabled {
        color: gray;
      }
      &.delete:enabled:not(.loading):hover {
        background-color: rgb(253 174 130 / 29%);
      }
      &.close:hover {
        background-color: rgb(220 220 220 / 35%);
      }
    }

    .loading {
      position: relative;
      color: transparent;
      transition: all 0.2s;
      background-color: rgb(255 154 98 / 35%);
      &::after {
        ${mixin.spinner('4px solid antiquewhite', `var(--primaryOrange)`)}
      }
    }
  }

  @media screen and (max-width: 980px) {
    .controller {
      padding: 0 2rem;
    }
  }
  @media screen and (max-width: 790px) {
    .controller {
      padding: 0 2rem;
    }
  }
`;

const Wrapper = styled(Container)`
  h2 {
    margin-top: 0.4rem;
  }
  .controller {
    padding: 0;
    button {
      transition: 0.3s all;
      width: 100%;
      background-color: var(--primaryPurple);
      filter: brightness(0.98);
      padding: 0.8rem 0;
      color: white;
      border-radius: 0.8rem;
      font-size: 1rem;
      font-weight: 600;

      &:hover {
        background-color: var(--primaryPurple);
        filter: brightness(1.05);
      }
    }
  }
`;

type WithdrawProps = {
  setWithdraw: React.Dispatch<React.SetStateAction<boolean>>;
};

type Progress = 'IDLE' | 'SUCCESS' | 'FAILURE';

const errText = {
  empty: '비밀번호를 입력해 주세요',
  inValid: '비밀번호가 일치하지 않습니다',
};
const Withdraw = ({ setWithdraw }: WithdrawProps) => {
  const [inputVal, setInputVal] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHide, setIsHide] = useState({
    idle: false,
    success: false,
    failure: false,
  });
  const [progress, setProgress] = useState<Progress>('IDLE');
  const [errMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputVal(e.target.value);
      if (inputVal.length === 0) setIsInvalid(false);
    },
    [inputVal]
  );

  const deleteAccount = useCallback(async () => {
    //# 빈값일 때 비밀번호를 입력해 주세요
    if (inputVal.length === 0) {
      setIsInvalid(true);
      setErrorMessage(errText['empty']);
      return;
    }

    try {
      setIsLoading(true);
      setIsInvalid(false);
      setErrorMessage('');
      await axios({
        method: 'delete',
        url: `${process.env.REACT_APP_SERVER_URL}/users`,
        data: { passwordCheck: inputVal },
        headers: { accesstoken: sessionStorage.getItem('accesstoken') ?? '' },
      });
      sessionStorage.clear();

      setIsHide((prevHide) => ({ ...prevHide, idle: true }));
      setTimeout(() => {
        setProgress('SUCCESS');
      }, 400);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        // 서버가 꺼졌을 때
        if (err.response?.data === undefined && err.response?.status === 0) {
          return setProgress('FAILURE');
        } else if (
          err.response?.status === 403 &&
          err.response.data.message === 'Wrong account And Password Combination'
        ) {
          // 비번이 틀렸을 때
          setIsInvalid(true);
          setErrorMessage(errText['inValid']);
          inputRef.current?.focus();
          return;
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [inputVal]);

  const errorHandler = () => {
    setIsHide((prevHide) => ({ ...prevHide, failure: true }));
    setTimeout(() => {
      setWithdraw(false);
    }, 400);
  };

  const confirmHandler = () => {
    window.location.replace('/');
  };

  const cancelHandler = () => {
    setIsHide((prevHide) => ({ ...prevHide, idle: true }));
    setTimeout(() => {
      setWithdraw(false);
    }, 400);
  };

  const modalStyle = {
    container: `border-radius: 2rem 2rem 1.8rem 1.8rem;
    box-shadow: 0 3px 11px #3b3b3b;
    max-width:18rem;
    height:10rem;`,
  };

  const successModalStyle = {
    container: `border-radius: 2rem 2rem 1.8rem 1.8rem;
    box-shadow: 0 3px 11px #3b3b3b;
    max-width:18rem;
    min-width:auto;
    width:17rem;
    min-height:auto;
    height:17rem;`,
    button: `width: 100%; background-color: var(--primaryPurple); padding: 0.8rem 0; color: white; border-radius: 0.8rem;font-size: 1rem;font-weight: 600;`,
  };

  if (progress === 'SUCCESS') {
    return (
      <Modal style={successModalStyle}>
        <Wrapper>
          <Confirm />
          <h1>계정 삭제가 완료 되었습니다</h1>
          <h2>이용해주셔서 감사합니다</h2>

          <section className="controller">
            <button onClick={confirmHandler}>확인</button>
          </section>
        </Wrapper>
      </Modal>
    );
  }

  if (progress === 'FAILURE') {
    return (
      <ServerFailModal
        hideStatus={isHide.failure}
        confirmError={errorHandler}
      ></ServerFailModal>
    );
  }

  return (
    <Modal style={modalStyle} hideStatus={isHide.idle}>
      <Container>
        <Auth />
        <h1>본인 인증을 위해 비밀번호를 입력해 주세요</h1>

        <input
          autoFocus={true}
          type="password"
          onChange={handleInput}
          placeholder="비밀번호 입력"
          disabled={isLoading}
          ref={inputRef}
        ></input>
        <div className="err-message">
          {inputVal && isInvalid && (
            <>
              <Invalid />
              {errMessage}
            </>
          )}
        </div>

        <section className="controller">
          <button className="close" onClick={cancelHandler}>
            돌아가기
          </button>
          <button
            className={`delete ${isLoading && 'loading'}`}
            disabled={inputVal.length === 0}
            onClick={deleteAccount}
          >
            탈퇴하기
          </button>
        </section>
      </Container>
    </Modal>
  );
};

export default Withdraw;
