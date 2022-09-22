import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
const ModalBackdrop = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  background: rgba(0, 0, 0, 0.4);
`;
const ModalContainer = styled.div`
  width: 400px;
  height: 460px;
  display: flex;
  flex-direction: column;

  text-align: center;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  position: relative;
  z-index: 100;
  position: fixed;
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
    color: #4363ff;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem 0;
    & input {
      border-radius: 6px;
      border: 1.8px solid #9d9d9d;
      padding: 0.5rem;
      margin-bottom: 1rem;
      width: 20rem;
      height: 3rem;
      &::placeholder {
        opacity: 0.5;
      }
    }
    & button {
      width: 20rem;
      height: 3rem;
      color: #fff;
      font-weight: bold;
      background: #4363ff;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        background: #3d5dff;
      }
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
  const [form, setForm] = useState({ account: '', password: '' });
  const { account, password } = form;
  const handleUserInfo = (e) => {
    const nextForm = {
      ...form,
      [e.target.name]: e.target.value,
    };

    setForm(nextForm);
  };

  const handleSubmit = (e) => {
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
      })
      .catch((err) => {
        console.log(err.response.data.message);
        // if (
        //   err.response.data.message === 'Wrong account And Password Combination'
        // ) {
        //   errorMessage.current.textContent = '비밀번호가 일치하지 않습니다';
        // } else if (err.response.data.message === "User Doesn't Exist") {
        //   errorMessage.current.textContent = '사용자가 존재하지 않습니다';
        // } else {
        //   console.log('그밖에에러');
        // }
      })
      .finally(() => {
        modalClose();
      });
  };
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
          ></input>
          <input
            name="password"
            placeholder="비밀번호를 입력해 주세요"
            onChange={handleUserInfo}
            type="password"
            value={password}
          ></input>
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
