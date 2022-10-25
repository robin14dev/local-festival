import React from 'react';
import peachmong from '../assets/peachmong.png';
import styled, { css } from 'styled-components';
import searchImage from '../assets/search-mobile.png';
import pickImage from '../assets/pick-mobile.png';
import profileImage from '../assets/profile-mobile.png';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const Wrapper = styled.div`
  width: 100%;
  height: 3rem;
  position: fixed;
  bottom: 0;
  display: flex;
  border-top: 1px solid lightgray;
  justify-content: flex-start;
  background-color: #f1f3f5;
  color: black;
  /* margin-top: 2rem; */
  padding: 0.5rem;
  /* box-shadow: 0 -2px 0 1px #f0f1f4; */
  img {
    width: 2rem;
    height: 2rem;
    margin-left: 1rem;
  }
  div {
    padding-left: 1rem;
    font-size: 0.7rem;
  }

  @media (max-width: 485px) {
    display: none;
  }
`;

const WrapperMobile = styled.div`
  background-color: white;
  position: fixed;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  padding: 0 3rem;
  height: 3.438rem;
  width: 100%;
  @media (min-width: 486px) {
    display: none;
  }
`;

const Item = styled.div`
  width: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    height: 1.5rem;
    width: 1.5rem;
  }
  div {
    font-weight: 400;
    font-size: 12px;
  }
`;

const Footer = ({ authState, setLoginModal }) => {
  let navigate = useNavigate();
  const goPage = useCallback(
    (path) => {
      if (authState.loginStatus) {
        navigate(`/${path}`);
      } else {
        setLoginModal(true);
      }
    },
    [authState]
  );

  return (
    <>
      <Wrapper>
        <img src={peachmong} alt="peachmong" />
        <div>Copyright © 2022 Peachmong All rights reserved.</div>
      </Wrapper>
      <WrapperMobile>
        <Item onClick={() => navigate('/')}>
          <img src={searchImage} alt="home"></img>
          <div>둘러보기</div>
        </Item>
        <Item path="MyPick" onClick={() => goPage('MyPick')}>
          <img src={pickImage} alt="mypick"></img>
          <div>위시리스트</div>
        </Item>
        <Item onClick={() => goPage('AccountSetting')}>
          <img src={profileImage} alt="profile"></img>
          <div>프로필</div>
        </Item>
      </WrapperMobile>
    </>
  );
};

export default Footer;
