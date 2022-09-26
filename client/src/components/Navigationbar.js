import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { RiAccountCircleFill } from 'react-icons/ri';
import styled from 'styled-components';

const ButtonsWrapper = styled.div`
  display: flex;
  height: 100%;
  margin: 0 3rem;
  z-index: 30;
  /* background-color: red; */

  @media (max-width: 840px) {
    right: 2rem;
  }
  @media (max-width: 600px) {
    right: 1rem;
  }
  @media (max-width: 500px) {
    right: 0.1rem;
  }
`;

const Button = styled.button`
  background: inherit;
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  overflow: visible;
  cursor: pointer;
  color: white;

  &:hover {
    color: var(--primaryGreen);
  }
`;
const ItemsWrapper = styled.div`
  position: absolute;
  top: 4rem;
  right: 1rem;
  width: 8rem;
  box-shadow: 1px 1.5px 2px gray;
  background-color: white;
  border-radius: 0.2rem;
  overflow: hidden;
  z-index: 31;

  & li {
    list-style: none;
    line-height: 2.5rem;
    text-align: left;
    text-align: left;
    padding-left: 0.5rem;
    cursor: pointer;

    /* border : 0.01px solid #dbd8d8; */

    &:hover {
      background-color: whitesmoke;
      z-index: 30;
    }
    &:active {
      background-color: white;
    }
  }
`;
// 로그아웃 모달 없애고 그냥 바로 로그아웃 되도록 하기
const Navigationbar = ({
  authState,
  loginHandler,
  setLoginModal,
  setSignupModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const NavItems = () => {
    const onClickLogout = () => {
      //# 클라이언트에서 토큰 지우기
      // localStorage.removeItem("accessToken");
      loginHandler('', '', '', false);
      navigate('/');
      window.sessionStorage.clear();
      setIsOpen(false);
    };

    const onClickMyPage = () => {
      navigate('/MyPick ');
    };
    const onClickAccount = () => {
      navigate('/AccountSetting');
    };
    return (
      <ItemsWrapper>
        <ul>
          <li onClick={onClickAccount}>계정</li>
          <li onClick={onClickMyPage}>위시리스트</li>
          <li onClick={onClickLogout}>로그아웃</li>
        </ul>
      </ItemsWrapper>
    );
  };

  let navigate = useNavigate();

  const onClickMoveMypage = () => {
    navigate('/MyPage');
  };

  // console.log(isLogin);
  return (
    <>
      {authState.loginStatus ? (
        <ButtonsWrapper
          onMouseEnter={() => {
            setIsOpen(true);
          }}
          onMouseLeave={() => {
            setIsOpen(false);
          }}
        >
          {isOpen && <NavItems />}
          <Button>
            <RiAccountCircleFill size={45} />
          </Button>
        </ButtonsWrapper>
      ) : (
        <ButtonsWrapper>
          <Button
            onClick={() => {
              setLoginModal(true);
            }}
          >
            <RiAccountCircleFill size={45} />
          </Button>
        </ButtonsWrapper>
      )}
    </>
  );
};

export default Navigationbar;
