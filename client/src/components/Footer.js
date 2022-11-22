import React from 'react';
import peachmong from '../assets/peachmong.png';
import styled, { css } from 'styled-components';
import searchImage from '../assets/search-mobile.png';
import pickImage from '../assets/pick-mobile.png';
import profileImage from '../assets/profile-mobile.png';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { ReactComponent as Account } from '../assets/profile.svg';
import { ReactComponent as MyPick } from '../assets/heart-empty.svg';
import { ReactComponent as Mainpage } from '../assets/search.svg';
const Wrapper = styled.footer`
  width: 100%;
  height: 3rem;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  border-top: 1px solid lightgray;
  justify-content: flex-start;
  background-color: #f1f3f5;
  color: black;
  padding: 0.5rem;
  img {
    width: 2rem;
    height: 2rem;
    margin-left: 1rem;
  }
  div {
    padding-left: 1rem;
    font-size: 0.7rem;
  }

  @media (max-width: 476px) {
    display: none;
  }
`;

const WrapperMobile = styled.footer`
  background-color: white;
  position: fixed;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  padding: 0 3rem;
  height: 3.438rem;
  width: 100%;
  @media (min-width: 476px) {
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
          {/* <img src={searchImage} alt="home"></img> */}
          <Mainpage width={23} height={23} fill={'#FF9A62'} />

          <div>둘러보기</div>
        </Item>
        <Item path="MyPick" onClick={() => goPage('MyPick')}>
          {/* <img src={pickImage} alt="mypick"></img> */}
          <MyPick width={23} height={23} fill={'#FF9A62'} />
          <div>위시리스트</div>
        </Item>
        <Item onClick={() => goPage('AccountSetting')}>
          {/* <img src={profileImage} alt="profile"></img> */}
          <Account width={23} height={23} fill={'#FF9A62'} />
          <div>프로필</div>
        </Item>
      </WrapperMobile>
    </>
  );
};

export default Footer;
