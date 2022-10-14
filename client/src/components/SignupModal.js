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
    color: ${(props) => props.theme.color.autumnOrange};
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
      /* align-self: flex-start; */
      /* margin-bottom: 0.5rem; */
      font-size: 1rem;
      /* width: 5.625rem; */
      /* background-color: yellow; */
      & + div {
        color: red;
        font-size: 0.8rem;
        word-break: normal;
        /* width: 220px; */
        padding-left: 1rem;
        /* background-color: yellowgreen; */
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
      background-color: ${(props) => props.theme.color.autumnOrange};

      /* &:active {
        color: ${(props) => props.theme.color.primaryGreen};
      } */
    }
  }
`;

const LoginSection = styled.div`
  margin-top: 1rem;
  & > button {
    margin-left: 1.2rem;
    color: ${(props) => props.theme.color.autumnOrange};
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

  const [validMsg, setValidMsg] = useState({
    account: '',
    nickname: '',
    password: '',
    passwordCheck: '',
  });

  /* 유효성 검사 에러메시지
  
  validation = {email : {valiDate::, style : }}
  
  이메일 중복 버튼 클릭
    중복 x => 사용가능한 이메일입니다 초록색 계속 떠있음
    중복 o => 이미 사용중인 이메일 입니다 빨간색 메시지
   //* 이메일 유효성 검사 =>  유효하지 않은 이메일 입니다. (handle)
    input 작성중일 때는 해당 에러, 성공 메시지 뜨지 않게
  
  닉네임 중복 버튼 클릭
  중복 x => 사용가능한 닉네임입니다 초록색 계속 떠있음
  중복 o => 이미 사용중인 닉네임 입니다 빨간색 메시지
  //* 닉네임 유효성 검사 => 유효하지 않은 닉네임입니다. (handle)
  input 작성중일 때는 해당 에러, 성공 메시지 뜨지 않게
  
  //* 비밀번호 입력중일 때 에러메시지 (handle)
  조건 충족하면 사용 가능한 비밀번호 입니다
         x   빨간에러메시지
  
  //* 비밀번호 확인 입력중일 때 에러메시지 (handle)
  
  
  */

  const { account, nickname, password, passwordCheck } = userInfo;

  const handleUserInfo = useCallback(
    (e) => {
      function validate(type) {
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

        switch (type) {
          case 'account':
            if (emailRgx.test(e.target.value) === false) {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.account.fail,
              }));
              document.body.querySelector(`.${e.target.name}`).style.color =
                'red';
            } else {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.account.success,
              }));
              document.body.querySelector(`.${e.target.name}`).style.color =
                'green';
            }

            break;

          case 'nickname':
            if (nicknameRgx.test(e.target.value) === false) {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.nickname.fail,
              }));
              document.body.querySelector(`.${e.target.name}`).style.color =
                'red';
            } else {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.nickname.success,
              }));
              document.body.querySelector(`.${e.target.name}`).style.color =
                'green';
            }
            break;

          case 'password':
            if (passwordRgx.test(e.target.value) === false) {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.password.fail,
              }));
              document.body.querySelector(`.${e.target.name}`).style.color =
                'red';
            } else {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.password.success,
              }));
              document.body.querySelector(`.${e.target.name}`).style.color =
                'green';
            }

            break;
          case 'passwordCheck':
            if (password !== e.target.value) {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.password.notSame,
              }));
              document.body.querySelector(`.${e.target.name}`).style.color =
                'red';
            } else {
              setValidMsg((prevMsg) => ({
                ...prevMsg,
                [e.target.name]: message.password.same,
              }));
              document.body.querySelector(`.${e.target.name}`).style.color =
                'green';
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
    (e) => {
      e.preventDefault();

      let pwdRgx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,}$/;

      if (pwdRgx.test(password) === false) {
        console.log('비밀번호 유효성 x');
        return;
      }
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
            onChange={(e) => {
              handleUserInfo(e, e.target.name);
            }}
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
            onChange={(e) => {
              handleUserInfo(e);
            }}
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
            onChange={(e) => {
              handleUserInfo(e);
            }}
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
