import React, { useContext, useState, memo } from "react";
import { IoPersonCircleOutline as DefaultProfileImg } from "react-icons/io5";
import { UserContext } from "../../contexts/userContext";
import { LoginModalContext } from "../../contexts/LoginModalContext";
import Menu from "./Menu";
import { Container } from "./styled";

const DropdownMenu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    authState: { loginStatus, defaultPic },
    setAuthState,
  } = useContext(UserContext);
  const { setIsLoginModal } = useContext(LoginModalContext);

  const showLoginModal = () => {
    console.log("클릭했다!!");

    !loginStatus && setIsLoginModal(true);
  };
  const toggleDropdownMenu = (instruction: "show" | "hide"): void => {
    if (loginStatus) {
      return instruction === "show"
        ? setShowDropdown(true)
        : setShowDropdown(false);
    }
  };
  const imgOnError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = "none";
    setAuthState((prevState) => ({
      ...prevState,
      defaultPic: "",
    }));
  };

  return (
    <>
      <Container
        data-testid="DropdownMenu"
        isLogin={loginStatus}
        isPic={defaultPic}
        onMouseEnter={() => toggleDropdownMenu("show")}
        onMouseLeave={() => toggleDropdownMenu("hide")}
      >
        <button data-testid="DropdownButton" onClick={showLoginModal}>
          {loginStatus && defaultPic ? (
            <img src={defaultPic} alt="유저 프로필 사진" onError={imgOnError} />
          ) : (
            <DefaultProfileImg />
          )}
        </button>
      </Container>
      {showDropdown && <Menu toggleDropdownMenu={toggleDropdownMenu} />}
    </>
  );
};

export default memo(DropdownMenu);
