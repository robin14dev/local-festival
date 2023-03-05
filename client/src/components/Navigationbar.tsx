import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiAccountCircleLine } from 'react-icons/ri';
import styled, { css } from 'styled-components';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { memo } from 'react';

const Container = styled.section`
  /* width: 30%; */
  height: 100%;
  display: flex;
  /* background-color: yellow; */

  .message {
    /* background-color: aliceblue; */
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 2rem;
    color: white;
    font-weight: 500;
  }
`;

const ButtonsWrapper = styled.div<{ isLogin: boolean; isPic: string }>`
  display: flex;
  /* width: 100%; */
  height: 100%;
  z-index: 30;
  justify-content: center;
  align-items: center;
  /* position: relative; */
  /* background-color: white; */
  overflow: hidden;
  padding: 0.5rem;
  button {
    background-color: white;
    min-width: 4rem;
    min-height: 4rem;
    width: 100%;
    border-radius: 50%;
    height: 100%;
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 80%;
      height: 80%;
    }

    svg {
      height: 100%;
      width: fit-content;
      min-height: 1.5rem;
      color: var(--primaryPurple);
    }
    /* ${(props) =>
      props.isLogin === false &&
      css`
        background-color: transparent;
        height: 100%;
        padding: 0.5rem 1rem;
        color: var(--primaryBlue);
        font-weight: 500;
      `} */
  }

  ${(props) =>
    (props.isLogin === false || (props.isLogin && !props.isPic)) &&
    css`
      background-color: transparent;
      height: 100%;

      button {
        height: 100%;
        background-color: transparent;

        svg {
          color: white;
        }
      }
    `}

  @media (max-width: 840px) {
    right: 2rem;
  }
  @media (max-width: 600px) {
    right: 1rem;
  }
  @media (max-width: 500px) {
    right: 0.1rem;
  }

  @media (max-width: 475px) {
    display: none;
  }
`;

const ItemsWrapper = styled.ul`
  position: absolute;
  top: 4rem;
  right: 1rem;
  width: 8rem;
  box-shadow: 1px 1.5px 2px gray;
  background-color: white;
  border-radius: 0.2rem;
  overflow: hidden;
  z-index: 100;

  & li {
    list-style: none;
    line-height: 2.5rem;
    text-align: left;
    text-align: left;
    padding-left: 0.5rem;
    cursor: pointer;

    &:hover {
      background-color: whitesmoke;
    }
    &:active {
      background-color: white;
    }
  }
`;

type NavigationbarProps = {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;

  loginHandler: loginHandlerFunc;
  setLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
};
const Navigationbar = ({
  authState,
  setAuthState,
  loginHandler,
  setLoginModal,
}: NavigationbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(authState);

  const NavItems = ({
    setIsOpen,
  }: {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const onClickLogout = () => {
      //# 클라이언트에서 토큰 지우기
      loginHandler(0, '', '', '', false);
      window.location.replace('/');

      window.sessionStorage.clear();
      setIsOpen(false);
    };

    const onClickMyPage = () => {
      navigate('/Wishlist ');
    };
    const onClickAccount = () => {
      navigate('/Account');
    };
    return (
      <ItemsWrapper
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <li onClick={onClickAccount}>계정</li>
        <li onClick={onClickMyPage}>위시리스트</li>
        <li onClick={onClickLogout}>로그아웃</li>
      </ItemsWrapper>
    );
  };

  let navigate = useNavigate();

  const imgOnError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
    setAuthState((prevState) => ({
      ...prevState,
      defaultPic: '',
    }));
  };
  //! img onerror!!!

  return (
    <Container>
      <ButtonsWrapper
        isLogin={authState.loginStatus}
        isPic={authState.defaultPic}
        onMouseEnter={() => {
          return authState.loginStatus ? setIsOpen(true) : undefined;
        }}
        onMouseLeave={() => {
          return authState.loginStatus ? setIsOpen(false) : undefined;
        }}
      >
        <button
          onClick={() => {
            !authState.loginStatus && setLoginModal(true);
          }}
        >
          {authState.loginStatus ? (
            authState.defaultPic ? (
              <img
                onError={imgOnError}
                src={authState.defaultPic}
                alt="유저 프로필 사진"
              />
            ) : (
              <IoPersonCircleOutline />
            )
          ) : (
            <IoPersonCircleOutline />
          )}
        </button>
      </ButtonsWrapper>
      {isOpen && <NavItems setIsOpen={setIsOpen} />}
    </Container>
  );
};

export default memo(Navigationbar);
