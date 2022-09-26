import axios from 'axios';
import React, { useState } from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 15%;
  left: 35%;
  right: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30rem;
  height: 35rem;
  border-radius: 10px;
  background-color: white;
  padding: 1rem;
  z-index: 100;

  h1 {
    font-size: 3rem;
    cursor: pointer;
    font-style: italic;
    font-family: 'HS-Regular';
    color: ${(props) => props.theme.color.primaryBlue};
    margin-bottom: 0.5rem;
  }
  form {
    display: flex;
    flex-direction: column;
    width: 80%;
    label {
      align-self: flex-start;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    input {
      width: 100%;
      height: 2.5rem;
      margin-bottom: 1rem;
      border: 1px solid lightgray;
      border-radius: 0.3rem;
    }

    button {
      border-radius: 4px;
      margin: 0.5rem 0;
      color: white;
      font-weight: bold;
      cursor: pointer;
      height: 3rem;
      width: 100%;
      font-size: 1rem;
      transition: all 0.2s ease-out;
      background-color: ${(props) => props.theme.color.primaryBlue};

      &:active {
        color: ${(props) => props.theme.color.primaryGreen};
      }
    }
  }
`;

const LoginSection = styled.div`
  & > button {
    margin-left: 1.2rem;
    color: ${(props) => props.theme.color.primaryBlue};
    font-weight: bold;
    font-size: 1rem;
  }
`;

const SignupModal = ({ setSignupModal, setLoginModal }) => {
  const [userInfo, setUserInfo] = useState({
    account: '',
    nickname: '',
    password: '',
    passwordCheck: '',
  });

  const { account, nickname, password, passwordCheck } = userInfo;

  const handleUserInfo = useCallback((e) => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (password !== passwordCheck) {
        console.log('password Not Match');

        document.body.querySelector('.errorMessage').textContent =
          '비밀번호가 일치하지 않습니다';
        document.body.querySelector('.errorMessage').style.fontWeight = 'bold';
      } else {
        //# 유효성 검증 후 서버에 회원가입 정보 전송 (주석 해제)
        axios
          .post(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/users/signup`, {
            account,
            password,
            nickname,
          })
          .then((response) => {
            console.log(response.data.message);
            setSignupModal(false);
            setLoginModal(true);
          })
          .catch((err) => {
            if (err.response.status === 409) {
              document.body.querySelector('.errorMessage').textContent =
                '이미 가입된 아이디 입니다.';
              document.body.querySelector('.errorMessage').style.fontWeight =
                'bold';
            }
          });
      }
    },
    [password, passwordCheck, account, nickname]
  );

  return (
    <>
      <ModalBackdrop
        onClick={() => {
          setSignupModal(false);
        }}
      />
      <ModalContainer
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1>LoCo</h1>
        <div className="errorMessage" style={{ color: 'Red' }}></div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="account">이메일 주소</label>
          <input
            name="account"
            type="text"
            value={account}
            required
            onChange={(e) => {
              handleUserInfo(e);
            }}
          />

          <label htmlFor="nickname">닉네임</label>
          <input
            name="nickname"
            type="text"
            value={nickname}
            required
            onChange={(e) => {
              handleUserInfo(e);
            }}
          />

          <label htmlFor="password">비밀번호</label>
          <input
            name="password"
            type="password"
            value={password}
            required
            onChange={(e) => {
              handleUserInfo(e);
            }}
          />

          <label htmlFor="passwordCheck">비밀번호 확인</label>
          <input
            name="passwordCheck"
            type="password"
            value={passwordCheck}
            required
            onChange={(e) => {
              handleUserInfo(e);
            }}
          />
          <button type="submit">회원가입</button>
        </form>

        <LoginSection>
          이미 계정이 있으신가요?{' '}
          <button
            onClick={() => {
              setSignupModal(false);
              setLoginModal(true);
            }}
          >
            로그인
          </button>
        </LoginSection>
      </ModalContainer>
    </>
  );
};

export default SignupModal;
