import React from "react";
import Navigationbar from "../DropdownMenu";
import styled from "styled-components";
import { memo } from "react";

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  height: 5rem;
  width: 100vw;
  align-items: center;
  background-color: var(--mainColor);
  padding: 0 3rem;

  position: fixed;
  z-index: 11;
  top: 0;

  & > h1 {
    font-size: 2rem;
    cursor: pointer;
    font-style: italic;
    font-family: "HS-Regular";
    color: rgba(255, 255, 255, 0.78);
  }
  @media (max-width: 475px) {
    justify-content: center;
  }
`;

type HeaderProps = {
  setIsLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ setIsLoginModal }: HeaderProps) => {
  const onClickReload = () => {
    window.location.replace("/");
  };

  return (
    <Wrapper>
      <h1 onClick={onClickReload}>LoCo</h1>
      <Navigationbar setIsLoginModal={setIsLoginModal} />
    </Wrapper>
  );
};

export default memo(Header);
