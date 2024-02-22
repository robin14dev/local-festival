import React, { useContext, useState, memo } from "react";
import styled, { css } from "styled-components";
import { IoPersonCircleOutline as DefaultProfileImg } from "react-icons/io5";
import { UserContext } from "../../contexts/userContext";
import Menu from "./Menu";

const Container = styled.div<{ isLogin: boolean; isPic: string }>`
  display: flex;
  height: 100%;
  z-index: 30;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0.5rem;
  button {
    background-color: white;
    min-width: 4rem;
    min-height: 4rem;
    width: 100%;
    border-radius: 50%;
    height: 100%;
    padding: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    svg {
      height: 100%;
      width: fit-content;
      min-height: 1.5rem;
      color: var(--primaryPurple);
    }
  }

  ${({ isLogin, isPic }) =>
    (isLogin === false || (isLogin && !isPic)) &&
    css`
      background-color: transparent;
      height: 100%;

      button {
        height: 100%;
        background-color: transparent;

        svg {
          color: white;
        }
      }
    `}

  @media (max-width: 840px) {
    right: 2rem;
  }
  @media (max-width: 600px) {
    right: 1rem;
  }
  @media (max-width: 500px) {
    right: 0.1rem;
  }

  @media (max-width: 475px) {
    display: none;
  }
`;

type DropdownMenuProps = {
  setIsLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownMenu = ({ setIsLoginModal }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    authState: { loginStatus, defaultPic },
    setAuthState,
  } = useContext(UserContext);

  const openLoginModal = () => {
    !loginStatus && setIsLoginModal(true);
  };
  const toggleDropdownMenu = (instruction: "show" | "hide"): void => {
    if (loginStatus) {
      return instruction === "show" ? setIsOpen(true) : setIsOpen(false);
    }
  };

  const imgOnError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = "none";
    setAuthState((prevState) => ({
      ...prevState,
      defaultPic: "",
    }));
  };
  //! img onerror!!!

  return (
    <>
      <Container
        data-testid="DropdownMenu"
        isLogin={loginStatus}
        isPic={defaultPic}
        onMouseEnter={() => toggleDropdownMenu("show")}
        onMouseLeave={() => toggleDropdownMenu("hide")}
      >
        <button onClick={openLoginModal}>
          {loginStatus && defaultPic ? (
            <img src={defaultPic} alt="유저 프로필 사진" onError={imgOnError} />
          ) : (
            <DefaultProfileImg />
          )}
        </button>
      </Container>
      {isOpen && <Menu />}
    </>
  );
};

export default memo(DropdownMenu);
