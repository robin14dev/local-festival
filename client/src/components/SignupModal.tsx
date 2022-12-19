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
  z-index: 100;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 27rem;
  height: 32rem;
  border-radius: 10px;
  background-color: white;
  padding: 1rem;

  h1 {
    font-size: 3rem;
    cursor: pointer;
    font-style: italic;
    font-family: 'HS-Regular';
    color: var(--mainColor);
    margin-bottom: 0.5rem;
  }
  form {
    display: flex;
    flex-direction: column;
    width: 100%;

    .validInfo {
      display: flex;
    }

    label {
      font-size: 1rem;

      & + div {
        color: red;
        font-size: 0.8rem;
        word-break: normal;
        padding-left: 1rem;
      }
    }

    input {
      width: 100%;
      height: 2.5rem;
      margin-bottom: 1rem;
      border: 1px solid lightgray;
      border-radius: 0.3rem;
      padding: 0.5rem;
    }

    & > button {
      border-radius: 4px;
      margin: 0.5rem 0;
      color: white;
      font-weight: bold;
      cursor: pointer;
      height: 3rem;
      width: 100%;
      font-size: 1rem;
      transition: all 0.2s ease-out;
      background-color: var(--mainColor);
    }
  }

  .modalClose {
    display: none;
  }

  @media screen and (max-width: 428px) {
    width: 100%;
    height: 100%;
    border-radius: 0;

    .modalClose {
      display: block;
      color: gray;
      margin-top: 1rem;
    }
  }
`;

const LoginSection = styled.div`
  margin-top: 1rem;
  & > button {
    margin-left: 1.2rem;
    color: var(--mainColor);
    font-weight: bold;
    font-size: 1rem;
  }
`;

type SignupModalProps = {
  setSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignupModal = ({ setSignupModal, setLoginModal }: SignupModalProps) => {
  const [userInfo, setUserInfo] = useState({
    account: '',
    nickname: '',
    password: '',
    passwordCheck: '',
  });

  const [validMsg, setValidMsg] = useState({
    account: '',
    nickname: '',
    password: '',
    passwordCheck: '',
  });

  const { account, nickname, password, passwordCheck } = userInfo;

  const handleUserInfo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      function validate(type: string) {
        let message = {
          account: {
            success: '사용가능한 이메일 입니다.',
            fail: '유효하지 않은 이메일 입니다',
            already: '이미 사용중인 이메일 입니다.',
          },
          nickname: {
            success: '사용가능한 닉네임 입니다',
            fail: '영문, 한글, 숫자 포함 4자에서 8자 이하여야 합니다',
            already: '이미 사용중인 닉네임 입니다.',
          },
          password: {
            success: '사용가능한 비밀번호 입니다',
            fail: '영문, 숫자, 특수문자 조합으로 최소 8자리 이상이여야 합니다',
            notSame: '비밀번호가 일치하지 않습니다.',
            same: '비밀번호가 일치합니다',
          },
        };
        let emailRgx = /[a-z0-9_!#$%^&*()-]+\@+[a-z0-9]+\.[a-z]+/;
        let nicknameRgx = /^[가-힣|a-z|A-Z|0-9|]{6,8}$/;
        let passwordRgx =
          /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!~@#$%^&+=]).*$/;

        const errMsgDom: HTMLElement | null = document.body.querySelector(
          `.${e.target.name}`
        );
        switch (type) {
          case 'account':
            if (emailRgx.test(e.target.value) === false) {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.account.fail,
              }));
              if (errMsgDom) {
                errMsgDom.style.color = 'red';
              }
            } else {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.account.success,
              }));
              if (errMsgDom) {
                errMsgDom.style.color = 'green';
              }
            }
            break;

          case 'nickname':
            if (nicknameRgx.test(e.target.value) === false) {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.nickname.fail,
              }));
              if (errMsgDom) {
                errMsgDom.style.color = 'red';
              }
            } else {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.nickname.success,
              }));
              if (errMsgDom) {
                errMsgDom.style.color = 'green';
              }
            }
            break;

          case 'password':
            if (passwordRgx.test(e.target.value) === false) {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.password.fail,
              }));
              if (errMsgDom) {
                errMsgDom.style.color = 'red';
              }
            } else {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.password.success,
              }));
              if (errMsgDom) {
                errMsgDom.style.color = 'green';
              }
            }

            break;
          case 'passwordCheck':
            if (password !== e.target.value) {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.password.notSame,
              }));
              if (errMsgDom) {
                errMsgDom.style.color = 'red';
              }
            } else {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.password.same,
              }));
              if (errMsgDom) {
                errMsgDom.style.color = 'green';
              }
            }

            break;
          default:
            break;
        }
      }

      validate(e.target.name);
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        [e.target.name]: e.target.value,
      }));
    },
    [password]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      let pwdRgx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,}$/;
      const errMsgDom: HTMLElement | null =
        document.body.querySelector('.errorMessage');

      if (pwdRgx.test(password) === false) {
        console.log('비밀번호 유효성 x');
        return;
      }
      if (password !== passwordCheck) {
        console.log('password Not Match');

        if (errMsgDom) {
          errMsgDom.textContent = '비밀번호가 일치하지 않습니다';
          errMsgDom.style.fontWeight = 'bold';
        }
      } else {
        //# 유효성 검증 후 서버에 회원가입 정보 전송 (주석 해제)
        axios
          .post(`${process.env.REACT_APP_SERVER_URL}/users/signup`, {
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
              if (errMsgDom) {
                errMsgDom.textContent = '이미 가입된 아이디 입니다.';
                errMsgDom.style.fontWeight = 'bold';
              }
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
        <form onSubmit={handleSubmit}>
          <div className="validInfo">
            <label htmlFor="account">이메일 주소</label>{' '}
            <div className="account">{validMsg.account}</div>
          </div>
          <input
            name="account"
            type="text"
            value={account}
            required
            onChange={handleUserInfo}
          />
          <div className="validInfo">
            <label htmlFor="nickname">닉네임</label>
            <div className="nickname">{validMsg.nickname}</div>
          </div>
          <input
            name="nickname"
            type="text"
            value={nickname}
            required
            onChange={handleUserInfo}
          />
          <div className="validInfo">
            <label htmlFor="password">비밀번호</label>{' '}
            <div className="password">{validMsg.password}</div>
          </div>
          <input
            name="password"
            type="password"
            value={password}
            required
            onChange={handleUserInfo}
          />
          <div className="validInfo">
            <label htmlFor="passwordCheck">비밀번호 확인</label>
            <div className="passwordCheck">{validMsg.passwordCheck}</div>
          </div>
          <input
            name="passwordCheck"
            type="password"
            value={passwordCheck}
            required
            onChange={handleUserInfo}
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
        <button
          className="modalClose"
          onClick={() => {
            setSignupModal(false);
            setLoginModal(false);
          }}
        >
          돌아가기
        </button>
      </ModalContainer>
    </>
  );
};

export default SignupModal;