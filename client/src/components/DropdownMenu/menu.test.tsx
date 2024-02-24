import React, { useContext } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import Menu from "./Menu";
import App from "../../App";
import { UserContext } from "../../contexts/userContext";
beforeEach(() => {
  const intersectionObserverMock = () => ({
    observe: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = jest
    .fn()
    .mockImplementation(intersectionObserverMock);
});

describe("Menu 컴포넌트", () => {
  it(" Menu 컴포넌트를 성공적으로 렌더링 합니다. ", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Menu />
      </MemoryRouter>
    );
    const menu = screen.getByTestId("Menu");
    expect(menu).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it("[계정] 메뉴 클릭시 계정 페이지로 이동합니다.", () => {
    const URLTestComponent = (): JSX.Element => {
      const { pathname } = useLocation();
      return <div>pathname is {pathname}</div>;
    };

    render(
      <MemoryRouter initialEntries={["/"]}>
        <URLTestComponent />
        <App />
        <Menu />
      </MemoryRouter>
    );

    const accountBtn = screen.getByTestId("Menu-AccountPage");
    const mainPage = screen.getByTestId("MainPage");
    const pathName = screen.getByText("pathname is /");

    expect(mainPage).toBeInTheDocument();
    expect(pathName).toBeInTheDocument();
    fireEvent.click(accountBtn);
    const accountPage = screen.getByTestId("AccountPage");
    expect(accountPage).toBeInTheDocument();
    expect(pathName.textContent).toBe("pathname is /Account");
  });
  it("[위시리스트] 메뉴 클릭시, 위시리스트 페이지로 이동합니다.", () => {
    const URLTestComponent = (): JSX.Element => {
      const { pathname } = useLocation();
      return <div>pathname is {pathname}</div>;
    };

    render(
      <MemoryRouter initialEntries={["/"]}>
        <URLTestComponent />
        <App />
        <Menu />
      </MemoryRouter>
    );

    const wishListBtn = screen.getByTestId("Menu-WishlistPage");
    const mainPage = screen.getByTestId("MainPage");
    const pathName = screen.getByText("pathname is /");

    expect(mainPage).toBeInTheDocument();
    expect(pathName).toBeInTheDocument();
    fireEvent.click(wishListBtn);
    const wishListPage = screen.getByTestId("WishlistPage");
    expect(wishListPage).toBeInTheDocument();
    expect(pathName.textContent).toBe("pathname is /Wishlist");
  });
  it("[로그아웃] 메뉴 클릭시 로그아웃 후, 메인페이지로 이동합니다.", () => {
    const URLTestComponent = (): JSX.Element => {
      const { pathname } = useLocation();
      return <div>pathname is {pathname}</div>;
    };
    const UserContextTest = (): JSX.Element => {
      const {
        authState: { loginStatus },
      } = useContext(UserContext);
      return (
        <>
          <div>{loginStatus ? "로그인" : "로그아웃"}</div>
        </>
      );
    };

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

    render(
      <MemoryRouter initialEntries={["/Wishlist"]}>
        <UserContext.Provider
          value={{
            authState: mockAuthState.login,
            setAuthState: mockSetAuthState,
          }}
        >
          <UserContextTest />
          <URLTestComponent />
          <App />
          <Menu />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const logoutBtn = screen.getByTestId("Menu-Logout");
    const wishListPage = screen.getByTestId("WishlistPage");
    const pathName = screen.getByText("pathname is /Wishlist");
    const loginStatus = screen.getByText("로그인");
    expect(wishListPage).toBeInTheDocument();
    expect(pathName).toBeInTheDocument();
    expect(loginStatus).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    const mainPage = screen.getByTestId("MainPage");
    expect(mainPage).toBeInTheDocument();
    expect(pathName.textContent).toBe("pathname is /");
    expect(loginStatus.textContent).toBe("로그아웃");
  });
});
