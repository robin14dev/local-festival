// - 컴포넌트 렌더링
//     - 로그인 상태 아니거나 기본이미지url없으면 기본 이미지 나오게
// - 마우스 가져가대면 드롭다운 열리고 없어지는거 테스트

//     -
import React, { useContext } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import DropdownMenu from "./index";
import { MemoryRouter } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";
import LoginModal from "../account/LoginModal";
import { ModalContext } from "../../contexts/modalContext";

const mockAuthState = {
  login: {
    loginStatus: true,
    userId: 1,
    account: "abc@abc.com",
    nickname: "abc",
    defaultPic: "",
  },
  logout: {
    loginStatus: false,
    userId: 0,
    account: "",
    nickname: "",
    defaultPic: "",
  },
};
const mockSetAuthState = jest.fn();

describe("DropdownMenu Component", () => {
  it("컴포넌트를 성공적으로 렌더링 합니다.", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <DropdownMenu />
      </MemoryRouter>
    );
    const dropdownMenu = screen.getByTestId("DropdownMenu");
    expect(dropdownMenu).toBeInTheDocument();
  });

  it("로그인 상태시, 마우스를 올려놓으면 드롭다운 메뉴가 렌더링 됩니다.", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <UserContext.Provider
          value={{
            authState: mockAuthState.login,
            setAuthState: mockSetAuthState,
          }}
        >
          <DropdownMenu />
        </UserContext.Provider>
      </MemoryRouter>
    );
    const dropdownMenu = screen.getByTestId("DropdownMenu");
    fireEvent.mouseEnter(dropdownMenu);
    const menu = screen.getByTestId("Menu");
    expect(menu).toBeInTheDocument();
  });

  it("로그인 상태시, 마우스가 요소에서 벗어나면 드롭다운 메뉴가 사라집니다.", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <UserContext.Provider
          value={{
            authState: mockAuthState.login,
            setAuthState: mockSetAuthState,
          }}
        >
          <DropdownMenu />
        </UserContext.Provider>
      </MemoryRouter>
    );
    const dropdownMenu = screen.getByTestId("DropdownMenu");
    fireEvent.mouseEnter(dropdownMenu);
    fireEvent.mouseLeave(dropdownMenu);
    const menu = screen.queryByTestId("Menu");
    expect(menu).not.toBeInTheDocument();
  });

  it("로그아웃 상태시, 마우스를 올려놓으면 드롭다운 메뉴가 렌더링 되지 않습니다.", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <UserContext.Provider
          value={{
            authState: mockAuthState.logout,
            setAuthState: mockSetAuthState,
          }}
        >
          <DropdownMenu />
        </UserContext.Provider>
      </MemoryRouter>
    );
    const dropdownMenu = screen.getByTestId("DropdownMenu");
    fireEvent.mouseEnter(dropdownMenu);
    const menu = screen.queryByTestId("Menu");
    expect(menu).not.toBeInTheDocument();
  });
  it("로그아웃 상태시, 해당 요소를 클릭하면 로그인 모달이 렌더링 됩니다.", () => {
    //Todo : 로그인 모달을 여기서 넣어줘야함
    // const isLoginModal = ModalContext.Consumer
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ModalContext.Provider
          value={{ isLoginModal: false, setIsLoginModal: jest.fn() }}
        >
          <UserContext.Provider
            value={{
              authState: mockAuthState.logout,
              setAuthState: mockSetAuthState,
            }}
          >
            <div>
              //! 얘는 무조건 있게 되는디...?
              {isLoginModal && (
                <LoginModal
                  loginHandler={jest.fn()}
                  setIsLoginModal={jest.fn()}
                />
              )}
              <DropdownMenu />
            </div>
          </UserContext.Provider>
        </ModalContext.Provider>
      </MemoryRouter>
    );
    /**
     * 시나리오
     * 처음엔 로그인 모달 안뜬 상태인데 누르고 나면 모달이 뜨게 되는 걸로 스토리 만들어야 됨
     */
    const loginModal = screen.getByTestId("LoginModal");
    expect(loginModal).not.toBeInTheDocument();
    const button = screen.getByTestId("DropdownButton");
    fireEvent.click(button);
    expect(loginModal).toBeInTheDocument();
  });
});
