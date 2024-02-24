import React from "react";
import { useNavigate } from "react-router-dom";
import { Ul } from "./styled";

export default function Menu() {
  let navigate = useNavigate();
  const onClickLogout = () => {
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <Ul data-testid="Menu">
      <li data-testid="Menu-AccountPage" onClick={() => navigate("/Account")}>
        계정
      </li>
      <li data-testid="Menu-WishlistPage" onClick={() => navigate("/Wishlist")}>
        위시리스트
      </li>
      <li data-testid="Menu-Logout" onClick={onClickLogout}>
        로그아웃
      </li>
    </Ul>
  );
}
