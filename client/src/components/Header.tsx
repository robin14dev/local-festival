import React from 'react';
import Navigationbar from './Navigationbar';
import styled from 'styled-components';

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  height: 5rem;
  width: 100vw;
  align-items: center;
  background-color: var(--mainColor);

  position: fixed;
  top: 0;
  z-index: 2;

  & > h1 {
    font-size: 2rem;
    cursor: pointer;
    font-style: italic;
    font-family: 'HS-Regular';
    color: rgba(255, 255, 255, 0.78);
    margin: 0 3rem;
  }
  @media (max-width: 475px) {
    justify-content: center;
  }
`;

type HeaderProps = {
  authState: AuthState;
  loginHandler: loginHandlerFunc;
  setLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ authState, loginHandler, setLoginModal }: HeaderProps) => {
  const onClickReload = () => {
    window.location.replace('/');
  };

  return (
    <Wrapper>
      <h1 onClick={onClickReload}>LoCo</h1>
      <Navigationbar
        setLoginModal={setLoginModal}
        loginHandler={loginHandler}
        authState={authState}
      />
    </Wrapper>
  );
};

export default Header;
