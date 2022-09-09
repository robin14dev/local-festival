import React from 'react';
import Navigationbar from './Navigationbar';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 5rem;
  width: 100vw;
  align-items: center;
  background-color: ${(props) => props.theme.color.primaryBlue};
  border-bottom: 1px solid lightgray;
  position: fixed;
  top: 0;
  z-index: 2;

  & > h1 {
    font-size: 2rem;
    cursor: pointer;
    font-style: italic;
    font-family: 'HS-Regular';
    color: ${(props) => props.theme.color.primaryGreen};
    margin: 0 3rem;
  }
`;

const Header = ({ authState, loginHandler }) => {
  const onClickReload = () => {
    window.location.replace('/');
  };
  return (
    <Wrapper>
      <h1 onClick={onClickReload}>LoCo</h1>
      <Navigationbar loginHandler={loginHandler} authState={authState} />
    </Wrapper>
  );
};

export default Header;
