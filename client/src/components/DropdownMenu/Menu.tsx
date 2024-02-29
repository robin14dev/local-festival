import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Ul } from "./styled";
import { UserContext } from "../../contexts/userContext";

type Props = {
  toggleDropdownMenu: (instruction: "show" | "hide") => void;
};
export default function Menu({ toggleDropdownMenu }: Props) {
  const { setAuthState } = useContext(UserContext);
  let navigate = useNavigate();
  const onClickLogout = () => {
    window.sessionStorage.clear();
    setAuthState({
      userId: 0,
      account: "",
      nickname: "",
      defaultPic: "",
      loginStatus: false,
    });
    toggleDropdownMenu("hide");
    navigate("/", { replace: true });
  };

  /**
   * setAuthState에 mock으로 껴주는게 맞는건지 모르겟음
   *
   *
   */

  return (
    <Ul
      data-testid="Menu"
      onMouseEnter={() => toggleDropdownMenu("show")}
      onMouseLeave={() => toggleDropdownMenu("hide")}
    >
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
