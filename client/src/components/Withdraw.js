import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useCallback } from 'react';

const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalView = styled.div`
  width: 30rem;
  height: 20rem;
  border-radius: 10px;
  background-color: #ffffff;
  padding: 2rem;
  position: fixed;
  z-index: 100;
  //3개 다 해줘야지 가운데 정렬됨
  margin: 10rem auto;
  left: 0;
  right: 0;

  form {
    margin: 3em 0;
    height: 3rem;
    padding: 0 0.7rem;
    display: flex;
    justify-content: space-between;
    input {
      width: 17rem;
      height: 2rem;
      border: 1px solid lightgray;
      border-radius: 0.3rem;
      padding: 0 0.5rem;

      & + div {
        margin: 0.5rem 0 0 0.2rem;
      }
    }

    button {
      height: 2rem;
      width: 6.5rem;
      background-color: ${(props) => props.theme.color.primaryBlue};
      color: white;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: bold;

      transition: transform 0.2s ease-out;
      &:hover {
        transition: transform 0.2s ease-out;
        transform: translateY(-5%);
      }
    }
  }
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: space-evenly;

  & > button {
    height: 2rem;
    width: 6.5rem;
    background-color: ${(props) => props.theme.color.primaryBlue};
    color: white;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;

    &:nth-child(2) {
      position: relative;
      left: -1rem;
    }

    transition: transform 0.2s ease-out;
    &:hover {
      transition: transform 0.2s ease-out;
      transform: translateY(-5%);
    }
  }
`;

const Withdraw = ({ setWithdrawModal, setFinishModal }) => {
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [errMessage, setErrorMessage] = useState('');
  const errMessageArr = [
    '비밀번호를 입력해 주세요',
    '비밀번호가 일치하지 않습니다.',
  ];
  const handlePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setIsInvalid(false);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      //# 빈값일 때 비밀번호를 입력해 주세요
      if (passwordCheck.length === 0) {
        setIsInvalid(true);
        setErrorMessage(errMessageArr[0]);
        return;
      }

      axios
        .delete(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/users`, {
          data: { passwordCheck: passwordCheck },
          headers: { accesstoken: sessionStorage.getItem('accesstoken') },
        })
        .then((response) => {
          if (response.data.message === 'successfully quit') {
            console.log('here');
          } else {
            console.log('일치하지 않을 때');
          }
          setWithdrawModal(false);
          setFinishModal(true);
        })
        .catch((err) => {
          //# 비밀번호가 일치하지 않을 때
          console.log(err);
          setIsInvalid(true);
          setErrorMessage(errMessageArr[1]);
        });
    },
    [passwordCheck]
  );

  return (
    <>
      <ModalBackdrop
        onClick={() => {
          setWithdrawModal(false);
        }}
      />
      <ModalView
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1>비밀번호를 한번 더 입력해 주세요</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              autoFocus={true}
              type="password"
              onChange={handlePasswordCheck}
              placeholder="비밀번호를 입력해 주세요"
            ></input>
            {isInvalid && <div style={{ color: 'Red' }}>{errMessage}</div>}
          </div>
          <button type="submit">탈퇴하기</button>
        </form>

        <ButtonSection>
          <button
            className="close-btn"
            onClick={() => {
              setWithdrawModal(false);
            }}
          >
            돌아가기
          </button>
        </ButtonSection>
      </ModalView>
    </>
  );
};

export default Withdraw;
