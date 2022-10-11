import React, { useState } from 'react';
import Navigationbar from './Navigationbar';
import styled from 'styled-components';
import { useLocation, useParams } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 5rem;
  width: 100%;
  align-items: center;
  /* background-color: ${(props) => props.theme.usingColor.mainColor}; */
  background-color: ${(props) => props.theme.usingColor.mainColor};
  /* border-bottom: 1px solid lightgray; */
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

const Header = ({ authState, loginHandler, setLoginModal, setSignupModal }) => {
  const onClickReload = () => {
    window.location.replace('/');
  };

  return (
    <Wrapper>
      <h1 onClick={onClickReload}>LoCo</h1>
      <Navigationbar
        setLoginModal={setLoginModal}
        setSignupModal={setSignupModal}
        loginHandler={loginHandler}
        authState={authState}
      />
    </Wrapper>
  );
};

export default Header;
