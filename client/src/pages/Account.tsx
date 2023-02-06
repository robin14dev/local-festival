import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import axios, { AxiosError } from 'axios';
import moment from 'moment';
import Withdraw from '../components/Withdraw';
import WithdrawDone from '../components/WithdrawDone';
import { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import EditImg from '../assets/edit-mobile.png';
import DeleteImg from '../assets/delete-mobile.png';
import { ReactComponent as Cancel } from '../assets/cancel.svg';
import {
  userInfo,
  validate,
  rgx,
  message,
  ShowValid,
  Progress,
} from '../components/SignupModal';

import { ReactComponent as Confirm } from '../assets/confirm.svg';
import { ReactComponent as Fail } from '../assets/server-fail.svg';

import Modal from '../components/Modal';
const Wrapper = styled.div`
  margin: 8rem 5rem;
  /* height: 55vh; */

  & > span {
    display: none;
  }
  #last-modified {
    color: gray;
    margin: 1rem;
  }
  @media (max-width: 700px) {
    margin: 8rem 2rem;
  }
  @media (max-width: 485px) {
    margin: 8rem 0;

    & > h1 {
      padding-left: 1rem;
    }

    & > span {
      display: inline-block;
      margin: 1rem;
      text-decoration: underline;
    }
  } ;
`;

const List = styled.div`
  transition: all 1s;
  margin-left: 0.5rem;

  @media (max-width: 485px) {
    margin: 0;
  }
`;

const Info = styled.div`
  transition: all 1s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  border-bottom: 1px solid #f2ebeb;
  padding-bottom: 2rem;

  @media (max-width: 485px) {
    padding: 0 1rem;
    min-height: 101px;
  } ;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  & > div {
    line-height: 1.5rem;
  }

  & > h4 {
    margin: 0.5rem 0;
  }

  padding-top: 0.8rem;
`;
const Toggle = styled.div`
  & > button {
    text-decoration: underline;
  }

  img {
    width: 1.5rem;
    height: auto;
  }
  svg {
    width: 1.8rem;
    height: auto;
  }
`;
const Accordion = styled.div`
  line-height: 1.5rem;
  margin-bottom: 1rem;
  form {
    width: 50%;
    max-width: 25rem;

    .input-valid {
      transition: all 0.3s;
      height: 2rem;
      border-radius: 0.3rem;
      border: 1px solid #ebebeb;
      padding-left: 0.5rem;
      width: 100%;
      &.valid {
        box-shadow: 0 0 3px var(--primaryPurple);
      }
      &.not-valid {
        box-shadow: 0 0 5px var(--primaryPink);
      }
    }
    @media screen and (max-width: 590px) {
      width: 100%;
      max-width: none;
    }
  }

  label {
    color: #7a7777;
  }
`;

const Button = styled.button<{ isLoading: boolean }>`
  background-color: var(--mainColor);
  color: white;
  height: 2rem;
  border-radius: 0.3rem;
  padding: 0 1rem;
  font-weight: 550;
  position: relative;
  transition: all 0.3s;

  ${(props) =>
    props.isLoading === true &&
    css`
      span {
        visibility: hidden;
        opacity: 0.5;
        transition: all 0.2s;
      }

      &:active {
        background: #007a63;
      }
      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border: 4px solid transparent;
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: button-loading-spinner 1s ease infinite;
      }
    `}

  @keyframes button-loading-spinner {
    from {
      transform: rotate(0turn);
    }

    to {
      transform: rotate(1turn);
    }
  }

  &:disabled {
    background-color: darkgray;
    &:hover {
      background-color: darkgray;
    }

    /*
   loading일 때 스피너 뜨게 하기
   
   */
  }
`;
const Nickname = styled(Accordion)`
  label {
    margin-bottom: 1rem;
  }
  & button {
    /* margin-left: 1rem; */

    /* &:hover {
      box-shadow: 1px 3px 1px rgba(217, 220, 224, 0.901);
    } */
  }
`;
const ValidMsg = styled(ShowValid)`
  padding-left: 0;
  margin: 0.5rem 0;
  height: 1rem;

  @media screen and (max-width: 320px) {
    font-size: 0.7rem;
  }
`;
const Password = styled(Accordion)`
  margin-top: 0.5rem;

  & > input {
    margin: 0.2rem 0;
    height: 1.8rem;
  }

  & button {
    margin-top: 1rem;
    &:hover {
      box-shadow: 1px 3px 1px rgba(217, 220, 224, 0.901);
    }
  }

  & > span {
    margin-left: 1rem;
    color: red;
  }
`;

type AccountProps = {
  authState: AuthState;
  handleAuthState: (nickname: string) => void;
  loginHandler: loginHandlerFunc;
};

export default function Account({
  authState,
  handleAuthState,
  loginHandler,
}: AccountProps) {
  const [isOpen, setIsOpen] = useState({
    nickname: false,
    password: false,
  });

  const [userInfo, setUserInfo] = useState<userInfo>({
    nickname: { text: '', isValid: false, isUnique: false },
    password: { text: '', isValid: false },
    passwordCheck: { text: '', isValid: false },
    curPassword: { text: '', isValid: true },
  });
  const [validMsg, setValidMsg] = useState({
    nickname: '',
    password: '',
    passwordCheck: '',
    curPassword: '',
  });

  const [openWithdrawModal, setWithdrawModal] = useState(false);
  const [finishWithdrawModal, setFinishModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState<Progress>('inProgress');
  const [updatedAt, setUpdatedAt] = useState('');
  const editType = useRef<null | string>(null);
  const inputhere = useRef<HTMLInputElement | null>(null);
  const errMessagePwd = useRef<HTMLSpanElement | null>(null);
  const { nickname, password, passwordCheck, curPassword } = userInfo;
  const pwRef = useRef<HTMLInputElement>(null);
  const curpwRef = useRef<HTMLInputElement>(null);
  const pwcheckRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    console.log('accountSetting!!');
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/users/edit`, {
        headers: { accesstoken: sessionStorage.getItem('accesstoken') ?? '' },
      })
      .then((response) => {
        console.log(response);
        setUpdatedAt(response.data.updatedAt);
      });
  }, []);
  const duplicateCheck = async (type: string, value: string) => {
    const checkType = type;

    console.log('duplicaatecheck');
    console.log(value, checkType, userInfo);

    // if (userInfo[checkType].isValid === false) {
    //   console.log('중복확인 누를 때 유효성 검사가 통과되지 않은경우');
    //   return;
    // }
    console.log('중복확인 누를 때 유효성 검사가 통과된경우');

    try {
      await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/signup`, {
        params: { [checkType]: value },
      });
      // 중복확인 버튼 비활성화 dom disabled로 해결

      setValidMsg((prevMsg) => ({
        ...prevMsg,
        [checkType]: message[checkType].unique,
      }));
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        [checkType]: {
          ...prevInfo[checkType],
          isUnique: true,
        },
      }));
      // 중복 메시지 색깔 styled-componnet로 해결
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.message === 'Network Error') {
          setProgress('failed');
          setLoading(false);
        }

        console.log(err.response);
        if (err.response?.data === `Already ${checkType}`) {
          console.log('here!!');

          setUserInfo((prevInfo) => ({
            ...prevInfo,
            [checkType]: {
              ...prevInfo[checkType],
              isUnique: false,
            },
          }));
          setValidMsg((prevMsg) => ({
            ...prevMsg,
            [checkType]: message[checkType].exist,
          }));
        }
      }
    }
  };
  const handleUserInfo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      //# 유효성 검사 실패시 isValid: false로 바꾸고 리턴

      const checkType = e.target.name;
      const value = e.target.value;

      if (progress === 'success' || progress === 'failed') {
        console.log('here');

        setProgress('inProgress');
      }

      if (checkType === 'curPassword') {
        setUserInfo((prevInfo) => ({
          ...prevInfo,
          [checkType]: { ...prevInfo[checkType], text: value, isValid: true },
        }));
        if (value.length !== 0)
          return setValidMsg((prevMsg) => ({
            ...prevMsg,
            [checkType]: '',
          }));
      }

      if (validate(checkType, value, rgx, password.text)) {
        console.log(checkType, value);

        // 유저정보 변경
        setUserInfo((prevInfo) => {
          const nextInfo = {
            ...prevInfo,
            [checkType]: { ...prevInfo[checkType], text: value, isValid: true },
          };
          if (checkType === 'nickname') {
            console.log(checkType);

            Object.assign(nextInfo[checkType], { isUnique: false });
          }
          return nextInfo;
        });
        // - 메시지 변경 (유효성 통과)
        setValidMsg((prevMsg) => ({
          ...prevMsg,
          [checkType]: '',
        }));

        if (checkType === 'nickname') {
          duplicateCheck(checkType, value);
        }
      } else {
        //# 유효성 실패시 isValid false
        setUserInfo((prevInfo) => {
          const nextInfo = {
            ...prevInfo,
            [checkType]: {
              ...prevInfo[checkType],
              text: value,
              isValid: false,
            },
          };
          if (checkType === 'account' || checkType === 'nickname') {
            Object.assign(nextInfo[checkType], { isUnique: false });
          }
          return nextInfo;
        });
        //# 메시지 보여주기
        //빈값이어서 실패한 경우
        if (value.length === 0) {
          setValidMsg((prevMsg) => ({
            ...prevMsg,
            [checkType]: '',
          }));
        } else {
          //빈값이 아닌 입력값이 유효성에  실패한 경우
          setValidMsg((prevMsg) => ({
            ...prevMsg,
            [checkType]: message[checkType].fail,
          }));
        }
      }
    },
    [userInfo, message, progress]
  );

  const accordionHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.currentTarget as HTMLButtonElement;
      const checkType = target.name as 'nickname' | 'password';

      if (isOpen[checkType] === false) {
        // 닫혀있으면 열고
        return setIsOpen((prev) => ({ ...prev, [checkType]: true }));
      }

      if (isOpen[checkType] === true) {
        // 열려있으면 닫고
        setIsOpen((prev) => ({ ...prev, [checkType]: false }));

        //# 닫을 때 해당 입력값 초기화 해주기(userInfo)
        setUserInfo((prevInfo) => {
          const nextInfo = {
            ...prevInfo,
            [checkType]: { ...[checkType], text: '', isValid: false },
          };
          if (checkType === 'password') {
            Object.assign(nextInfo, {
              passwordCheck: { text: '', isValid: false },
              curPassword: { text: '', isValid: true },
            });
          }

          return nextInfo;
        });
        //# 메시지도 초기화 해주기
        setValidMsg((prevMsg) => {
          const nextMsg = {
            ...prevMsg,
            [checkType]: '',
          };
          if (checkType === 'password') {
            Object.assign(nextMsg, { passwordCheck: '', curPassword: '' });
          }
          return nextMsg;
        });
      }
    },
    [isOpen]
  );

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    ...type: string[]
  ) => {
    e.preventDefault();
    const typeList = [...type];

    const validUserInfo = (typeList: string[]): boolean => {
      for (const type of typeList) {
        if (userInfo[type].isValid === false) return false;
        /* //!isUnique 있으면 true인지도 확인 false면 바로 false */
        if (
          userInfo[type].hasOwnProperty('isUnique') &&
          userInfo[type]['isUnique'] === false
        )
          return false;
      }
      return true;
    };

    if (validUserInfo(typeList) === false) return;
    if (progress === 'success' || progress === 'failed') {
      setProgress('inProgress');
    }
    if (typeList[0] === 'nickname') {
      const checkType = 'nickname';
      setLoading(true);
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/users/nickname`,
          { nickname: userInfo.nickname.text },
          {
            headers: {
              accesstoken: sessionStorage.getItem('accesstoken') ?? '',
            },
          }
        );
        const nextNickname = response.data.data.nickname;

        // 젼역정보수정
        handleAuthState(nextNickname);

        // 모달메시지 세팅
        editType.current = '닉네임이';
        setProgress('success');
        setLoading(false);
        // 아코디언 닫기
        setIsOpen((prev) => ({ ...prev, [typeList[0]]: false }));

        // 기존 입력값과 메시지 초기화
        setValidMsg((prevMsg) => {
          const nextMsg = {
            ...prevMsg,
            [checkType]: '',
          };

          return nextMsg;
        });
        setUserInfo((prevInfo) => {
          const nextInfo = {
            ...prevInfo,
            [checkType]: {
              ...prevInfo[checkType],
              isValid: false,
              text: '',
              isUnique: false,
            },
          };

          return nextInfo;
        });

        // 기본 상태로 바꾸기
        setTimeout(() => {
          setProgress('inProgress');
        }, 3000);
      } catch (error) {
        setLoading(false);
        setProgress('failed');
      }
    }

    if (typeList[0] === 'password') {
      const { curPassword, password, passwordCheck } = userInfo;
      const pwdForm = {
        currentPassword: curPassword.text,
        newPassword: password.text,
        passwordCheck: passwordCheck.text,
      };

      try {
        //# 비밀번호칸 입력하고 비밀번호 확인칸 입력하고 비밀번호칸을 수정했을 때 에러 체크
        if (password.text !== passwordCheck.text)
          throw new Error('passwordCheck is not valid');

        setLoading(true);
        const response = await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/users/password`,
          pwdForm,
          {
            headers: {
              accesstoken: sessionStorage.getItem('accesstoken') ?? '',
            },
          }
        );

        const { updatedAt } = response.data;

        // input값들 초기화
        setUserInfo((prevInfo) => ({
          ...prevInfo,
          password: { ...password, text: '', isValid: false },
          passwordCheck: { ...passwordCheck, text: '', isValid: false },
          curPassword: { ...password, text: '' },
        }));

        //모달메시지 준비
        editType.current = '비밀번호가';

        // 아코디언 닫으면서 최종수정일 업데이트
        setUpdatedAt(updatedAt);
        setIsOpen((prev) => ({ ...prev, [typeList[0]]: false }));

        //모달 띄우기
        setProgress('success');
        setLoading(false);

        setTimeout(() => {
          setProgress('inProgress');
        }, 3000);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message === 'passwordCheck is not valid') {
            setUserInfo((prevInfo) => ({
              ...prevInfo,
              passwordCheck: { ...passwordCheck, isValid: false },
            }));
            setValidMsg((prevMsg) => ({
              ...prevMsg,
              passwordCheck: message.passwordCheck.fail,
            }));
            if (pwcheckRef.current) {
              pwcheckRef.current.focus();
            }
            return;
          }
        }

        //! 아래 지우면 안됨
        if (err instanceof AxiosError) {
          if (err.message === 'Network Error') {
            setProgress('failed');
            setLoading(false);
          }

          if (
            err.response?.data.message ===
            'New password cannot be the same as the current password'
          ) {
            setLoading(false);
            const checkType = 'password';

            setUserInfo((prevInfo) => ({
              ...prevInfo,
              password: { ...password, isValid: false },
            }));

            setValidMsg((prevMsg) => {
              const nextMsg = Object.assign(prevMsg, {
                [checkType]: message[checkType].exist,
              });

              return nextMsg;
            });

            if (pwRef.current) {
              pwRef.current.focus();
            }
            return;
          }

          if (err.response?.data.message === 'Wrong Password') {
            setLoading(false);
            const checkType = 'curPassword';
            setUserInfo((prevInfo) => {
              const nextInfo = {
                ...prevInfo,
                [checkType]: {
                  ...prevInfo[checkType],
                  isValid: false,
                },
              };

              return nextInfo;
            });
            setValidMsg((prevMsg) => ({
              ...prevMsg,
              [checkType]: message[checkType].fail,
            }));
            if (curpwRef.current) {
              curpwRef.current.focus();
            }
            return;
          }
        }

        console.log(err);
      }
    }
  };

  const onClickLogout = useCallback(() => {
    loginHandler(0, '', '', false);
    window.location.replace('/');
    window.sessionStorage.clear();
  }, []);
  // const { currentPassword, newPassword, passwordCheck } = pwdForm;
  console.log(editType);

  return (
    <>
      {openWithdrawModal && (
        <Withdraw
          setFinishModal={setFinishModal}
          setWithdrawModal={setWithdrawModal}
        />
      )}
      {finishWithdrawModal && <WithdrawDone setFinishModal={setFinishModal} />}
      <Wrapper>
        <Helmet>
          <title>계정 관리 - LOCO</title>
        </Helmet>
        <h1>계정</h1>

        <List>
          <Info>
            <Heading>
              <h4>닉네임</h4>
              <Toggle>
                <button name="nickname" onClick={accordionHandler}>
                  {isOpen.nickname ? (
                    <Cancel alt="취소" />
                  ) : (
                    <img src={EditImg} alt="수정" />
                  )}
                </button>
              </Toggle>
            </Heading>

            {isOpen.nickname ? (
              <Nickname>
                <label htmlFor="nickname">변경할 닉네임을 입력해 주세요</label>
                <br></br>

                <form onSubmit={(e) => handleSubmit(e, 'nickname')}>
                  <input
                    className={`input-valid ${
                      nickname.text
                        ? nickname.isValid
                          ? 'valid'
                          : 'not-valid'
                        : ''
                    }`}
                    ref={inputhere}
                    onChange={handleUserInfo}
                    placeholder={authState.nickname}
                    name="nickname"
                    value={nickname.text}
                  ></input>
                  <ValidMsg
                    checkType={'nickname'}
                    isValid={nickname.isValid}
                    isUnique={nickname.isUnique}
                  >
                    {validMsg.nickname}
                  </ValidMsg>

                  <Button
                    isLoading={isLoading}
                    disabled={!(nickname.isValid && nickname.isUnique)}
                    type="submit"
                  >
                    <span>수정하기</span>
                  </Button>
                </form>
              </Nickname>
            ) : (
              <div style={{ color: 'gray' }}>{authState.nickname}</div>
            )}
          </Info>

          <Info>
            <Heading>
              <h4>비밀번호</h4>
              <Toggle>
                <button name="password" onClick={accordionHandler}>
                  {isOpen.password ? (
                    <Cancel alt="취소" />
                  ) : (
                    <img src={EditImg} alt="수정" />
                  )}
                </button>
              </Toggle>
            </Heading>

            {isOpen.password && (
              <Password>
                <form
                  onSubmit={(e) => handleSubmit(e, 'password', 'passwordCheck')}
                >
                  <label htmlFor="curPassword">현재 비밀번호</label>
                  <br />
                  <input
                    ref={curpwRef}
                    className={`input-valid ${
                      curPassword.text
                        ? curPassword.isValid
                          ? 'valid'
                          : 'not-valid'
                        : ''
                    }`}
                    required
                    type={'password'}
                    onChange={handleUserInfo}
                    name="curPassword"
                    value={curPassword.text}
                  />
                  <ValidMsg
                    checkType={'curPassword'}
                    isValid={curPassword.isValid}
                  >
                    {validMsg.curPassword}
                  </ValidMsg>
                  <label htmlFor="password">새 비밀번호</label>
                  <br />
                  <input
                    ref={pwRef}
                    className={`input-valid ${
                      password.text
                        ? password.isValid
                          ? 'valid'
                          : 'not-valid'
                        : ''
                    }`}
                    required
                    type={'password'}
                    onChange={handleUserInfo}
                    name="password"
                    value={password.text}
                  />
                  <ValidMsg checkType={'password'} isValid={password.isValid}>
                    {validMsg.password}
                  </ValidMsg>
                  <label htmlFor="passwordCheck">비밀번호 확인</label>
                  <br />
                  <input
                    ref={pwcheckRef}
                    className={`input-valid ${
                      passwordCheck.text
                        ? passwordCheck.isValid
                          ? 'valid'
                          : 'not-valid'
                        : ''
                    }`}
                    required
                    type={'password'}
                    onChange={handleUserInfo}
                    name="passwordCheck"
                    value={passwordCheck.text}
                  />
                  <ValidMsg
                    checkType={'passwordCheck'}
                    isValid={passwordCheck.isValid}
                  >
                    {validMsg.passwordCheck}{' '}
                  </ValidMsg>
                  <Button
                    isLoading={isLoading}
                    disabled={!(password.isValid && passwordCheck.isValid)}
                    type="submit"
                  >
                    <span>비밀번호 변경</span>
                  </Button>
                </form>
                <span ref={errMessagePwd}></span>
              </Password>
            )}

            {/* {!isOpen.password && (
              <div style={{ color: 'gray' }}>
                최종수정일 :{' '}
                {moment(updatedAt).format('YYYY년 MM월 DD일 HH시 mm분')}
              </div>
            )} */}
          </Info>
          <Info>
            <Heading>
              <h4>계정 삭제</h4>
              <Toggle>
                <button
                  onClick={() => {
                    setWithdrawModal(true);
                  }}
                >
                  <img src={DeleteImg} alt="삭제" />
                </button>
              </Toggle>
            </Heading>
          </Info>
        </List>
        <div id="last-modified">
          최종수정일 : {moment(updatedAt).format('YYYY년 MM월 DD일 HH시 mm분')}
        </div>
        <span onClick={onClickLogout}>로그아웃</span>
      </Wrapper>
      {!isLoading && progress === 'success' && (
        <Modal
          timer={{ time: 3000 }}
          containerStyle={{ color: 'black', width: '50vw', height: '' }}
          clickOption={{ back: false }}
          btnOption={{
            text: '확인',
            style: {
              color: 'white',
              backGroundColor: 'var(--primaryPurple)',
            },
          }}
        >
          <Confirm />
          <div>
            <h1>{editType.current} 변경되었습니다</h1>
            <h2>잠시 후에 계정페이지로 돌아갑니다</h2>
          </div>
        </Modal>
      )}
      {!isLoading && progress === 'failed' && (
        <Modal
          timer={null}
          containerStyle={{ color: 'black', width: '50vw', height: '' }}
          clickOption={{ back: false }}
          btnOption={{
            text: '확인',
            style: {
              color: 'white',
              backGroundColor: 'var(--primaryPurple)',
            },
          }}
        >
          <Fail />
          <div>
            <h1>서버와의 연결에 실패했습니다</h1>
            <h2>잠시 후에 다시 시도해 주세요</h2>
          </div>
        </Modal>
      )}
    </>
  );
}
