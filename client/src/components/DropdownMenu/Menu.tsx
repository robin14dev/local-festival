import React from "react";
import { useNavigate } from "react-router-dom";
import { Ul } from "./styled";

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
    <Ul data-testid="Menu">
      <li onClick={onClickAccount}>계정</li>
      <li onClick={onClickMyPage}>위시리스트</li>
      <li onClick={onClickLogout}>로그아웃</li>
    </Ul>
  );
}
