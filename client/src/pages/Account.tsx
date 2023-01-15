import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import axios from 'axios';
import moment from 'moment';
import Withdraw from '../components/Withdraw';
import WithdrawDone from '../components/WithdrawDone';
import { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import EditImg from '../assets/edit-mobile.png';
import DeleteImg from '../assets/delete-mobile.png';
import { ReactComponent as Cancel } from '../assets/cancel.svg';

const Wrapper = styled.div`
  margin: 8rem 5rem;
  height: 55vh;

  & > span {
    display: none;
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
const Button = styled.div`
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
  input {
    height: 2rem;
    border-radius: 0.3rem;
    border: 1px solid #d1cece;
    padding-left: 0.5rem;
  }
  button {
    background-color: var(--mainColor);
    color: white;
    height: 2rem;
    border-radius: 0.3rem;
    padding: 0 1rem;
    font-weight: 550;
  }

  label {
    color: #7a7777;
  }
`;
const Nickname = styled(Accordion)`
  /* label {
    margin: 1.5rem 0rem;
  } */

  label {
    margin-bottom: 1rem;
  }
  & button {
    margin-left: 1rem;

    &:hover {
      box-shadow: 1px 3px 1px rgba(217, 220, 224, 0.901);
    }
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
  const [nickname, setNickname] = useState(authState.nickname);
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    passwordCheck: '',
  });
  const [openWithdrawModal, setWithdrawModal] = useState(false);
  const [finishWithdrawModal, setFinishModal] = useState(false);
  const [updatedAt, setUpdatedAt] = useState('');

  const inputhere = useRef<HTMLInputElement | null>(null);
  const errMessagePwd = useRef<HTMLSpanElement | null>(null);

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

  const nicknameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const profileHandler = () => {
    if (inputhere.current) {
      if (inputhere.current.value === '') {
        document.querySelector('.errorMessage')!.textContent =
          '최소 한 글자 이상의 단어를 적어주세요';
      } else {
        axios
          .put(
            `${process.env.REACT_APP_SERVER_URL}/users/nickname`,
            { nickname },
            {
              headers: {
                accesstoken: sessionStorage.getItem('accesstoken') ?? '',
              },
            }
          )
          .then((response) => {
            const nextNickname = response.data.nickname;

            handleAuthState(nextNickname);
            window.location.replace('/Account');
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const openModalHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.currentTarget as HTMLButtonElement;
      const name = target.name as 'nickname' | 'password';

      if (isOpen[name] === false) {
        // 닫혀있으면 열고
        return setIsOpen((prev) => ({ ...prev, [name]: true }));
      }

      if (isOpen[name] === true) {
        // 열려있으면 닫고
        setIsOpen((prev) => ({ ...prev, [name]: false }));

        // 닫을 때 해당 입력값 초기화 해주기
        if (name === 'nickname') return setNickname('');
        if (name === 'password')
          return setPwdForm((prev) => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            passwordCheck: '',
          }));
      }
    },
    [isOpen]
  );

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPwdForm((prevForm) => ({
        ...prevForm,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );
  const submitPwd = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { currentPassword, newPassword, passwordCheck } = pwdForm;

      if (!currentPassword) {
        if (errMessagePwd.current) {
          errMessagePwd.current.textContent = '현재 비밀번호를 입력해 주세요';
        }
        return;
      }
      if (!newPassword) {
        if (errMessagePwd.current) {
          errMessagePwd.current.textContent = '새 비밀번호를 입력해 주세요';
        }
        return;
      }
      if (newPassword && !passwordCheck) {
        if (errMessagePwd.current) {
          errMessagePwd.current.textContent =
            '비밀번호를 한번 더 입력해 주세요';
        }
        return;
      }

      if (newPassword !== passwordCheck) {
        console.log('here');

        if (errMessagePwd.current) {
          errMessagePwd.current.textContent =
            '새로 입력한 비밀번호가 서로 일치하지 않습니다.';
        }
        return;
      }
      axios
        .put(`${process.env.REACT_APP_SERVER_URL}/users/password`, pwdForm, {
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken') ?? '',
          },
        })
        .then((response) => {
          console.log(response);
          const { message, updatedAt } = response.data;
          if (message === 'password successfully changed') {
            if (errMessagePwd.current) {
              errMessagePwd.current.textContent = '비밀번호가 변경되었습니다.';
              setUpdatedAt(updatedAt);
            }
          }
        })
        .catch((err) => {
          console.log('errrrr', err.response.data.message);

          if (err.response.data.message === 'Wrong Password') {
            if (errMessagePwd.current) {
              errMessagePwd.current.textContent =
                '기존 비밀번호가 일치하지 않습니다.';
            }
          } else {
            console.log(err);
          }
        });
    },
    [pwdForm]
  );

  const onClickLogout = useCallback(() => {
    loginHandler(0, '', '', false);
    window.location.replace('/');
    window.sessionStorage.clear();
  }, []);

  const { currentPassword, newPassword, passwordCheck } = pwdForm;
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
              <Button>
                <button name="nickname" onClick={openModalHandler}>
                  {isOpen.nickname ? (
                    <Cancel alt="취소" />
                  ) : (
                    <img src={EditImg} alt="수정" />
                  )}
                </button>
              </Button>
            </Heading>

            {isOpen.nickname ? (
              <Nickname>
                <label htmlFor="nickname">변경할 닉네임을 입력해 주세요</label>
                <br></br>
                <input
                  ref={inputhere}
                  onChange={nicknameHandler}
                  placeholder={authState.nickname}
                  name="nickname"
                  value={nickname}
                ></input>
                <button onClick={profileHandler}>수정하기</button>
              </Nickname>
            ) : (
              <div style={{ color: 'gray' }}>{authState.nickname}</div>
            )}
          </Info>

          <Info>
            <Heading>
              <h4>비밀번호</h4>
              <Button>
                <button name="password" onClick={openModalHandler}>
                  {isOpen.password ? (
                    <Cancel alt="취소" />
                  ) : (
                    <img src={EditImg} alt="수정" />
                  )}
                </button>
              </Button>
            </Heading>

            {isOpen.password && (
              <Password>
                <form onSubmit={submitPwd}>
                  <label htmlFor="currentPassword">현재 비밀번호</label>
                  <br />
                  <input
                    type={'password'}
                    onChange={onChangeHandler}
                    name="currentPassword"
                    value={currentPassword}
                  />
                  <br />
                  <label htmlFor="newPassword">새 비밀번호</label>
                  <br />
                  <input
                    type={'password'}
                    onChange={onChangeHandler}
                    name="newPassword"
                    value={newPassword}
                  />
                  <br />
                  <label htmlFor="passwordCheck">비밀번호 확인</label>
                  <br />
                  <input
                    type={'password'}
                    onChange={onChangeHandler}
                    name="passwordCheck"
                    value={passwordCheck}
                  />
                  <br />
                  <button type="submit">비밀번호 변경</button>
                </form>
                <span ref={errMessagePwd}></span>
              </Password>
            )}

            {!isOpen.password && (
              <div style={{ color: 'gray' }}>
                최종수정일 :{' '}
                {moment(updatedAt).format('YYYY년 MM월 DD일 HH시 mm분')}
              </div>
            )}
          </Info>
          <Info>
            <Heading>
              <h4>계정 삭제</h4>
              <Button>
                <button
                  onClick={() => {
                    setWithdrawModal(true);
                  }}
                >
                  <img src={DeleteImg} alt="삭제" />
                </button>
              </Button>
            </Heading>
          </Info>
        </List>
        <span onClick={onClickLogout}>로그아웃</span>
      </Wrapper>
    </>
  );
}
