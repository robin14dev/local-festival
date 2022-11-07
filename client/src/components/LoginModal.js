import axios from 'axios';
import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
const ModalBackdrop = styled.div`
  z-index: 10;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
`;
const ModalContainer = styled.div`
  z-index: 100;
  position: fixed;
  width: 400px;
  height: 460px;
  display: flex;
  flex-direction: column;

  text-align: center;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  margin-top: -256px;
  margin-left: -200px;
  left: 50%;
  top: 50%;

  & > h1 {
    margin: 2rem 0;
    font-size: 3rem;
    cursor: pointer;
    font-style: italic;
    font-family: 'HS-Regular';
    color: ${(props) => props.theme.color.autumnOrange};
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem 0;
    input {
      border-radius: 6px;
      border: 1.8px solid #b1aeae;
      padding: 0.5rem;
      width: 20rem;
      height: 3rem;
      &::placeholder {
        opacity: 0.5;
      }
    }
    div {
      min-height: 1rem;
      color: red;
      font-size: 0.8rem;
      align-self: flex-start;
      margin-left: 3rem;
      margin-bottom: 1rem;
      padding-top: 0.2rem;
    }
    button {
      width: 20rem;
      height: 3rem;
      margin-top: 1rem;
      color: #fff;
      font-weight: bold;
      background: ${(props) => props.theme.color.autumnOrange};
      border-radius: 6px;
      cursor: pointer;
    }
  }

  & div {
    display: flex;
    justify-content: space-around;
    font-size: 1rem;

    & > button {
      width: 50%;
      padding-right: 32px;
      &:nth-child(1) {
        border-right: 1px solid black;
        padding-left: 32px;
        padding-right: 0;
      }
    }
  }

  p {
    color: red;
  }
`;
const LoginModal = ({ setLoginModal, loginHandler, setSignupModal }) => {
  const [userInfo, setUserInfo] = useState({ account: '', password: '' });
  const { account, password } = userInfo;
  const [errMessage, setErrMessage] = useState('');

  const errMessages = [
    '사용자가 존재하지 않습니다',
    '비밀번호가 일치하지 않습니다',
  ];

  const handleUserInfo = useCallback((e) => {
    if (e.target.value.length > 0) setErrMessage('');
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/users/signin`, {
          account,
          password,
        })
        .then((response) => {
          //# 토큰과 유저정보를 받아온다.
          sessionStorage.setItem('accesstoken', response.data.data.token);

          const { nickname, userId, account } = response.data.data;
          //# 토큰 설정

          loginHandler(userId, account, nickname, true);
          // }
          modalClose();
        })
        .catch((err) => {
          console.log(err.response.data.message);
          if (
            err.response.data.message ===
            'Wrong account And Password Combination'
          ) {
            setErrMessage(errMessages[1]);
          } else if (err.response.data.message === "User Doesn't Exist") {
            setErrMessage(errMessages[0]);
          } else {
            console.log('그밖에에러');
          }
        });
    },
    [account, password]
  );
  const modalClose = () => {
    setLoginModal(false);
  };
  return (
    <>
      <ModalBackdrop onClick={modalClose} />
      <ModalContainer>
        <h1>Loco</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="account"
            placeholder="email을 입력해 주세요"
            onChange={handleUserInfo}
            type="text"
            value={account}
            required
          ></input>
          <div>{errMessage === '사용자가 존재하지 않습니다' && errMessage}</div>
          <input
            name="password"
            placeholder="비밀번호를 입력해 주세요"
            onChange={handleUserInfo}
            type="password"
            value={password}
            required
          ></input>
          <div>
            {errMessage === '비밀번호가 일치하지 않습니다' && errMessage}
          </div>
          <button type="submit">로그인</button>
        </form>
        <div>
          <button>비밀번호 재설정</button>
          <button
            onClick={() => {
              setLoginModal(false);
              setSignupModal(true);
            }}
          >
            회원가입
          </button>
        </div>
      </ModalContainer>
    </>
  );
};

export default LoginModal;
