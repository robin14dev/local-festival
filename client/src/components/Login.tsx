import axios from 'axios';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import Signup from './Signup';

const Backdrop = styled.div<{ isHide: boolean }>`
  z-index: 20;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);

  animation-duration: 0.4s;
  animation-name: ${(props) => (props.isHide ? 'bright-soft' : 'dark-soft')};
  animation-fill-mode: forwards;
`;
const Container = styled.div<{ isHide: boolean }>`
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

  animation-duration: 0.4s;
  animation-name: ${(props) => (props.isHide ? 'slide-up' : 'slide-down')};
  animation-fill-mode: forwards;

  & > h1 {
    margin: 2rem 0;
    font-size: 3rem;
    cursor: pointer;
    font-style: italic;
    font-family: 'HS-Regular';
    color: var(--mainColor);
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
      width: 80%;
      height: 3rem;
      font-family: 'NanumSquareRound';
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
      width: 80%;
      height: 3rem;
      margin-top: 1rem;
      font-size: 1rem;

      color: #fff;
      font-family: 'NanumSquareRound';
      font-weight: bold;
      background: var(--mainColor);
      border-radius: 6px;
      cursor: pointer;
    }
  }

  .footer {
    display: flex;
    /* background-color: yellow; */
    justify-content: center;
    align-items: center;
    font-size: 0.9rem;
    font-weight: 500;

    button {
      font-family: 'NanumSquareRound';
      margin-left: 1rem;
      font-size: 1rem;
      /* background-color: yellowgreen; */
      color: var(--primaryPurple);
      font-weight: bold;
      padding-bottom: 3px;
      transition: all 0.2s;
      &:hover {
        color: var(--primaryOrange);
        border-radius: 5px;
      }
    }
  }

  p {
    color: red;
  }

  .modalClose {
    display: none;
  }

  @media screen and (max-width: 428px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
    margin: 0;
    left: 0;
    top: 0;

    .modalClose {
      display: block;
      margin-top: 2rem;
      color: gray;
      font-family: 'NanumSquareRound';
    }
  }
`;

/*
백드롭은 계속 어둡게 하고 
로그인  => 회원가입 => 성공 => 실패

*/

type LoginProps = {
  setIsLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  loginHandler: loginHandlerFunc;
};

const Login = ({ setIsLoginModal, loginHandler }: LoginProps) => {
  const [userInfo, setUserInfo] = useState({ account: '', password: '' });
  const { account, password } = userInfo;
  const [errMessage, setErrMessage] = useState('');
  const [isHide, setIsHide] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isSignup, setIsSignup] = useState(false);

  const errMessages = [
    '사용자가 존재하지 않습니다',
    '비밀번호가 일치하지 않습니다',
  ];

  const handleUserInfo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length > 0) setErrMessage('');
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/users/signin`, {
          account,
          password,
        })
        .then((response) => {
          //# 토큰과 유저정보를 받아온다.
          const { nickname, userId, account, defaultPic } = response.data.info;
          const user = {
            account,
            nickname,
            userId,
            defaultPic,
            loginStatus: true,
          };
          sessionStorage.setItem('user', JSON.stringify(user));
          sessionStorage.setItem('accesstoken', response.data.info.token);

          loginHandler(userId, account, nickname, defaultPic, true);

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
    setIsHide(true);
    setIsSignup(false);
    setTimeout(() => {
      setIsLoginModal(false);
    }, 400);
  };
  return (
    <>
      <Backdrop onClick={modalClose} isHide={isHide}>
        {isLogin && (
          <Container
            isHide={isHide}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
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
              <div>
                {errMessage === '사용자가 존재하지 않습니다' && errMessage}
              </div>
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
            <div className="footer">
              <span>아직 계정이 없으신가요?</span>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setIsSignup(true);
                }}
              >
                회원가입
              </button>
            </div>
            <button
              className="modalClose"
              onClick={() => {
                setIsLoginModal(false);
              }}
            >
              돌아가기
            </button>
          </Container>
        )}

        {isSignup && (
          <Signup setIsSignup={setIsSignup} setIsLogin={setIsLogin} />
        )}
      </Backdrop>
    </>
  );
};

export default Login;
