import axios, { AxiosError } from 'axios';
import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { ReactComponent as Confirm } from '../assets/confirm.svg';
import { ReactComponent as ServerFail } from '../assets/server-fail.svg';
import Loading, { Wrapper as W } from './Loading';
import { useEffect } from 'react';

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
  justify-content: center;
  width: 27rem;
  height: 33.5rem;
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
    text-align: center;
  }
  .signupForm {
    display: flex;
    flex-direction: column;
    width: 100%;
    form {
      display: flex;
      flex-direction: column;
      width: 100%;

      .validInfo {
        display: flex;
        justify-content: space-between;
        /* background-color: yellowgreen; */
        height: 1.8rem;

        label {
          font-size: 1rem;
          /* background-color: lightpink; */
          height: 100%;
          display: flex;
          align-items: center;
        }
        button {
          background-color: var(--mainColor);
          color: white;
          margin: 0 0.1rem;
          margin-left: 1rem;
          height: fit-content;
          padding: 0.2rem;
          border-radius: 0.2rem;
          font-size: 0.9rem;
          transition: all 0.2s;

          &:disabled {
            background-color: darkgray;
            &:hover {
              background-color: darkgray;
            }
          }
          &:hover {
            background-color: var(--primaryBlue);
          }
        }

        div {
          /* background-color: yellow; */
          font-size: 0.8rem;
          font-weight: bold;
          font-family: 'NanumSquareRound';
          word-break: normal;
          padding-left: 0.5rem;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;
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
        background-color: var(--mainColor);
        transition: all 0.2s;
        &:hover {
          background-color: var(--primaryBlue);
        }
      }
    }
  }

  .signupSuccess,
  .errMessage {
    display: flex;

    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    h1 {
      font-size: 4rem;
    }
    svg {
      width: 30%;
      height: 30%;
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        font-size: 1.2rem;
        font-family: 'NanumSquareRound';
        line-height: 1.8;
        &:nth-child(1) {
          font-weight: bold;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        &:nth-child(2) {
          /* color: var(--primaryOrange); */
        }

        &:nth-child(3) {
          span {
            font-size: 1.2rem;
            color: var(--primaryOrange);
          }
        }
        span {
          font-size: 1.8rem;
          color: var(--primaryPurple);
          font-weight: bold;
        }
      }
    }

    button {
      color: var(--primaryPurple);
      border-radius: 0.5rem;
      font-family: 'NanumSquareRound';
      font-size: 1.1rem;
      border: 1.7px dashed var(--primaryPurple);
      padding: 0.3rem;
      transition: all 0.2s;
      &:hover {
        background-color: var(--primaryPurple);
        color: white;
        transform: translateY(-0.2rem);
      }
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

const LoadingWrapper = styled(W)`
  width: 100%;
  h1 {
    font-size: 4rem;
  }
`;
const LoginSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  p {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  button {
    margin-left: 1.2rem;
    color: var(--mainColor);
    font-weight: bold;
    font-size: 1rem;
    transition: all 0.2s;

    &:hover {
      color: var(--primaryOrange);
      /* padding: 0.1rem 0.2rem 0 0.2rem; */
      /* border-bottom: 1px solid var(--primaryPurple); */
    }
  }
`;

type SignupModalProps = {
  setSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type Message = {
  [index: string]: {
    success: string;
    fail: string;
    empty: string;
    already?: string;
    unique?: string;
  };
};

type userInfo = {
  [index: string]: {
    text: string;
    isValid: boolean;
    isUnique?: boolean;
  };
};

type Rgx = {
  [index: string]: RegExp;
  account: RegExp;
  nickname: RegExp;
  password: RegExp;
};

export const rgx: Rgx = {
  account: /[a-z0-9_!#$%^&*()-]+\@+[a-z0-9]+\.[a-z]+/,
  nickname: /^[가-힣|a-z|A-Z|0-9|]{4,8}$/,
  password: /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!~@#$%^&+=]).*$/,
};

const SignupModal = ({ setSignupModal, setLoginModal }: SignupModalProps) => {
  const [userInfo, setUserInfo] = useState<userInfo>({
    account: { text: '', isValid: false, isUnique: false },
    nickname: { text: '', isValid: false, isUnique: false },
    password: { text: '', isValid: false },
    passwordCheck: { text: '', isValid: false },
  });
  const [validMsg, setValidMsg] = useState({
    account: '',
    nickname: '',
    password: '',
    passwordCheck: '',
  });
  const [isLoading, setLoading] = useState(false);
  type Progress = 'inProgress' | 'success' | 'failed';
  const [progress, setProgress] = useState<Progress>('inProgress');
  const dupliCheckBtnAccount = useRef<HTMLButtonElement | null>(null);
  const dupliCheckBtnNickname = useRef<HTMLButtonElement | null>(null);
  const { account, nickname, password, passwordCheck } = userInfo;
  const message: Message = {
    account: {
      success: '중복 확인을 눌러주세요',
      fail: '유효하지 않은 이메일 형식 입니다',
      already: '이미 사용중인 이메일 입니다.',
      unique: '가입이 가능한 이메일입니다',
      empty: '',
    },
    nickname: {
      success: '중복 확인을 눌러주세요',
      fail: '영문, 한글, 숫자 포함 4자에서 8자 이하여야 합니다',
      already: '이미 사용중인 닉네임 입니다.',
      unique: '사용이 가능한 닉네임입니다',
      empty: '',
    },
    password: {
      success: '사용이 가능한 비밀번호 입니다',
      fail: '영문, 숫자, 특수문자 조합으로 최소 8자리 이상이여야 합니다',
      empty: '',
    },
    passwordCheck: {
      success: '비밀번호가 일치합니다',
      fail: '비밀번호가 일치하지 않습니다',
      empty: '',
    },
  };

  const handleUserInfo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      function validate(type: string) {
        const validType = type as
          | 'account'
          | 'nickname'
          | 'password'
          | 'passwordCheck';

        // type Rgx = {
        //   [index: string]: RegExp;
        //   account: RegExp;
        //   nickname: RegExp;
        //   password: RegExp;
        // };

        // const rgx: Rgx = {
        //   account: /[a-z0-9_!#$%^&*()-]+\@+[a-z0-9]+\.[a-z]+/,
        //   nickname: /^[가-힣|a-z|A-Z|0-9|]{4,8}$/,
        //   password: /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!~@#$%^&+=]).*$/,
        // };

        const errMsgDom: HTMLElement | null = document.body.querySelector(
          `.${e.target.name}`
        );
        //#1 빈값일때는 메시지 안보이게
        if (e.target.value === '') {
          setValidMsg((prevMsg) => ({
            ...prevMsg,
            [e.target.name]: '',
          }));

          setUserInfo((prevInfo) => ({
            ...prevInfo,
            [e.target.name]: {
              ...prevInfo[e.target.name],
              isValid: false,
            },
          }));

          return false;
        }

        //#2 빈값이 아닐때 정규식 체크
        if (rgx[validType]) {
          //#2-1 정규식이 있는 account, nickname의 중복확인여부 isUnique를 계속 false
          if (e.target.name === 'account' || e.target.name === 'nickname') {
            console.log(e.target.value);

            // 계정과 닉네임은 다시 작성시 중복확인을 또 해줘야하므로 작성중에는 isUnique계속 false
            setUserInfo((prevInfo) => ({
              ...prevInfo,
              [e.target.name]: {
                ...prevInfo[e.target.name],
                isUnique: false,
              },
            }));
            if (
              e.target.name === 'account' &&
              dupliCheckBtnAccount.current?.disabled === true
            ) {
              dupliCheckBtnAccount.current.disabled = false;
            }
            if (
              e.target.name === 'nickname' &&
              dupliCheckBtnNickname.current?.disabled === true
            ) {
              dupliCheckBtnNickname.current.disabled = false;
            }
          }
          //#2-2 정규식이 있는 account, nickname, password가 통과 못했을 때
          if (rgx[validType].test(e.target.value) === false) {
            setValidMsg((prevMsg) => ({
              ...prevMsg,
              [e.target.name]: message[validType].fail,
            }));
            setUserInfo((prevInfo) => ({
              ...prevInfo,
              [e.target.name]: {
                ...prevInfo[e.target.name],
                text: e.target.value,
                isValid: false,
              },
            }));

            if (errMsgDom) {
              errMsgDom.style.color = 'red';
            }
            return false;
          } else {
            setValidMsg((prevMsg) => ({
              ...prevMsg,
              [e.target.name]: message[validType].success,
            }));
            setUserInfo((prevInfo) => ({
              ...prevInfo,
              [e.target.name]: {
                ...prevInfo[e.target.name],
                text: e.target.value,
                isValid: true,
              },
            }));

            if (errMsgDom) {
              if (e.target.name === 'account' || e.target.name === 'nickname') {
                errMsgDom.style.color = 'var(--primaryOrange)';
                return true;
              }
              errMsgDom.style.color = 'green';
            }
            return true;
          }
        } else {
          // 정규식이 없으면 없는대로 체크
          if (password.text !== e.target.value) {
            setValidMsg((prevMsg) => ({
              ...prevMsg,
              [e.target.name]: message.passwordCheck.fail,
            }));
            setUserInfo((prevInfo) => ({
              ...prevInfo,
              [e.target.name]: {
                ...prevInfo[e.target.name],
                text: e.target.value,
                isValid: false,
              },
            }));
            if (errMsgDom) {
              errMsgDom.style.color = 'red';
            }
            return false;
          } else {
            setValidMsg((prevMsg) => ({
              ...prevMsg,
              [e.target.name]: message.passwordCheck.success,
            }));
            setUserInfo((prevInfo) => ({
              ...prevInfo,
              [e.target.name]: {
                ...prevInfo[e.target.name],
                text: e.target.value,
                isValid: true,
              },
            }));
            if (errMsgDom) {
              errMsgDom.style.color = 'green';
            }
          }
          return true;
        }
      }

      //# 유효성 검사 실패시 isValid: false로 바꾸고 리턴

      if (validate(e.target.name) === false) {
        return setUserInfo((prevInfo) => ({
          ...prevInfo,
          [e.target.name]: {
            ...prevInfo[e.target.name],
            text: e.target.value,
            isValid: false,
          },
        }));
      }

      console.log('설마 여기?');

      //# 유효성 검사 통과시 isValid: true 바꾸고 리턴
      return setUserInfo((prevInfo) => ({
        ...prevInfo,
        [e.target.name]: {
          ...prevInfo[e.target.name],
          text: e.target.value,
          isValid: true,
        },
      }));
    },
    [userInfo]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const validUserInfo = (): boolean => {
        for (const info in userInfo) {
          if (userInfo[info].isValid === false) return false;
          /* //!isUnique 있으면 true인지도 확인 false면 바로 false */
          if (
            userInfo[info].hasOwnProperty('isUnique') &&
            userInfo[info]['isUnique'] === false
          )
            return false;
        }
        return true;
      };

      //# 유효성 검사와 중복 체크가 하나라도 false면 return
      if (validUserInfo() === false) return;

      //# 유효성 검증 & 중복체크 통과시, 서버에 회원가입 정보 전송

      try {
        setLoading(true);
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/users/signup`,
          {
            account: account.text,
            password: password.text,
            nickname: nickname.text,
          }
        );
        console.log('success!!');

        //# 회원가입 성공시, 성공메시지와 함께 3초 뒤 로그인 모달로 이동

        setProgress('success');
        setLoading(false);
      } catch (error) {
        console.log('fail!!');
        console.log(error);
        setProgress('failed');
        setLoading(false);
      }
    },
    [userInfo]
  );

  const duplicateCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    const errMsgDom: HTMLInputElement | null = document.body.querySelector(
      `.${target.name}`
    );
    if (userInfo[target.name].isValid === false) {
      // console.log('중복확인 누를 때 유효성 검사가 통과되지 않은경우');
      return;
    }
    // console.log('중복확인 누를 때 유효성 검사가 통과된경우');

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/users/signup`,
        {
          params: { [target.name]: userInfo[target.name].text },
        }
      );
      if (target.name === 'account' && dupliCheckBtnAccount.current) {
        dupliCheckBtnAccount.current.disabled = true;
      }
      if (target.name === 'nickname' && dupliCheckBtnNickname.current) {
        dupliCheckBtnNickname.current.disabled = true;
      }

      setValidMsg((prevMsg) => ({
        ...prevMsg,
        [target.name]: message[target.name].unique,
      }));
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        [target.name]: {
          ...prevInfo[target.name],
          isUnique: true,
        },
      }));
      if (errMsgDom) {
        errMsgDom.style.color = 'green';
      }

      // console.log(response);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.log(err.response);
        if (err.response?.data === `Already ${target.name}`) {
          console.log('here!!');

          setUserInfo((prevInfo) => ({
            ...prevInfo,
            [target.name]: {
              ...prevInfo[target.name],
              isUnique: false,
            },
          }));
          setValidMsg((prevMsg) => ({
            ...prevMsg,
            [target.name]: message[target.name].already,
          }));
          if (errMsgDom) {
            errMsgDom.style.color = 'red';
          }
        }
      }
    }
  };

  /*
  회원가입 버튼 눌러서 유효성, 중복 다 통과하면 로딩 나오면서 서버로 보내기
  서버에서 받아오면 isLoading false로 해주면서 끝 

  회원가입 진행중이면 inProgress
  회원가입 성공이면   completed
  회원가입 실패면     failed
  
  */

  const Success = () => {
    const [count, setCount] = useState(3);
    useEffect(() => {
      const timer = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);

      let closeModal = setTimeout(() => {
        setSignupModal(false);
        setLoginModal(true);
      }, 4000);
      return () => {
        clearInterval(timer);
        clearInterval(closeModal);
      };
    }, []);
    return (
      <div className="signupSuccess">
        <h1>
          Let's{' '}
          <span style={{ color: 'var(--primaryOrange)', fontSize: '5rem' }}>
            LoCo
          </span>
        </h1>
        <Confirm />
        <div>
          <p>
            환영합니다 <span>{nickname.text}</span>님!
          </p>
          <p>회원 가입이 완료되었습니다</p>
          <p>
            <span style={{ color: 'var(--primaryPurple)' }}>{count}</span>초
            뒤에 <span>로그인</span>화면으로 넘어갑니다
          </p>
        </div>
      </div>
    );
  };

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
        {isLoading && (
          <LoadingWrapper>
            <h1>Loco</h1>
            <Loading text={'Loading'} />
          </LoadingWrapper>
        )}
        {!isLoading && progress === 'inProgress' ? (
          <div className="signupForm">
            <h1>LoCo</h1>
            <form>
              <div className="validInfo">
                <label htmlFor="account">이메일 주소</label>{' '}
                <div className="account">{validMsg.account}</div>
                <button
                  ref={dupliCheckBtnAccount}
                  name="account"
                  onClick={duplicateCheck}
                >
                  중복 확인
                </button>
              </div>
              <input
                name="account"
                type="text"
                value={account.text}
                required
                onChange={handleUserInfo}
              />
              <div className="validInfo">
                <label htmlFor="nickname">닉네임</label>
                <div className="nickname">{validMsg.nickname}</div>
                <button
                  ref={dupliCheckBtnNickname}
                  name="nickname"
                  onClick={duplicateCheck}
                >
                  중복 확인
                </button>
              </div>
              <input
                name="nickname"
                type="text"
                value={nickname.text}
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
                value={password.text}
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
                value={passwordCheck.text}
                required
                onChange={handleUserInfo}
              />
              <button onClick={handleSubmit}>회원가입</button>
            </form>

            <LoginSection>
              <p>이미 계정이 있으신가요?</p>
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
              }}
            >
              돌아가기
            </button>
          </div>
        ) : !isLoading && progress === 'success' ? (
          <Success />
        ) : !isLoading && progress === 'failed' ? (
          <div className="errMessage">
            <h1>
              Let's{' '}
              <span style={{ color: 'var(--primaryOrange)', fontSize: '5rem' }}>
                LoCo
              </span>
            </h1>
            <ServerFail />
            <div>
              <p>서버와의 연결이 끊어졌습니다</p>
              <p>잠시 후에 다시 시도해 주세요</p>
            </div>
            <button
              onClick={() => {
                setSignupModal(false);
              }}
            >
              메인페이지로 돌아가기
            </button>
          </div>
        ) : null}
      </ModalContainer>
    </>
  );
};

export default SignupModal;
