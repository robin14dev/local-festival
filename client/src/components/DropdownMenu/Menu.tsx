import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
export default function Menu() {
  let navigate = useNavigate();
  const onClickLogout = () => {
    sessionStorage.clear();
    window.location.replace("/");
  };

  const onClickMyPage = () => {
    navigate("/Wishlist ");
  };
  const onClickAccount = () => {
    navigate("/Account");
  };
  return (
    <ItemsWrapper>
      <li onClick={onClickAccount}>계정</li>
      <li onClick={onClickMyPage}>위시리스트</li>
      <li onClick={onClickLogout}>로그아웃</li>
    </ItemsWrapper>
  );
}
