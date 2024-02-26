import React from "react";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "../../App";
import Footer from ".";
import { UserContext } from "../../contexts/userContext";
import { LoginModalContextProvider } from "../../contexts/LoginModalContext";
import {
  URLTestComponent,
  intersectionObserverMock,
  mockAuthState,
  mockSetAuthState,
} from "../../test/mock";

beforeEach(() => {
  window.IntersectionObserver = jest
    .fn()
    .mockImplementation(intersectionObserverMock);
});

describe("<Footer/> 테스트", () => {
  it("모바일 너비에 따라 컴포넌트가 성공적으로 렌더링 됩니다", () => {
    // const mediaQueryList = window.matchMedia("(min-width: 476px)");

    global.innerWidth = 480;
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByTestId("Footer-mobile")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it("데스크탑 너비에 따라 컴포넌트가 성공적으로 렌더링 됩니다", () => {
    global.innerWidth = 481;
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByTestId("Footer")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it("모바일 UI일 경우, [둘러보기]를 클릭하면 메인 페이지로 이동합니다", () => {
    global.innerWidth = 480;

    const { container } = render(
      <MemoryRouter initialEntries={["/Wishlist"]}>
        <UserContext.Provider
          value={{
            authState: mockAuthState.login,
            setAuthState: mockSetAuthState,
          }}
        >
          <URLTestComponent />
          <App />
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByTestId("WishlistPage")).toBeInTheDocument();
    const gotoMainpageBtn = screen.getByText("둘러보기");
    const pathName = screen.getByText("pathname is /Wishlist");
    expect(gotoMainpageBtn).toBeInTheDocument();
    fireEvent.click(gotoMainpageBtn);
    expect(screen.getByTestId("MainPage")).toBeInTheDocument();
    expect(pathName.textContent).toBe("pathname is /");
  });
  it("모바일 UI일 경우, 로그인 상태일 때, [위시리스트]를 클릭하면 위시리스트 페이지로 이동합니다", () => {
    global.innerWidth = 480;

    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <UserContext.Provider
          value={{
            authState: mockAuthState.login,
            setAuthState: mockSetAuthState,
          }}
        >
          <URLTestComponent />
          <App />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("MainPage")).toBeInTheDocument();
    const pathName = screen.getByText("pathname is /");
    const button = screen.getByText("위시리스트");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByTestId("WishlistPage")).toBeInTheDocument();
    expect(pathName.textContent).toBe("pathname is /Wishlist");
  });
  it("모바일 UI일 경우, 로그인 상태일 때, [프로필]을 클릭하면 계정 페이지로 이동합니다", () => {
    global.innerWidth = 480;

    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <UserContext.Provider
          value={{
            authState: mockAuthState.login,
            setAuthState: mockSetAuthState,
          }}
        >
          <URLTestComponent />
          <App />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("MainPage")).toBeInTheDocument();
    const pathName = screen.getByText("pathname is /");
    const button = screen.getByText("프로필");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByTestId("AccountPage")).toBeInTheDocument();
    expect(pathName.textContent).toBe("pathname is /Account");
  });
  it("모바일 UI일 경우, 로그아웃 상태일 때, [위시리스트] 또는 [프로필]을  클릭하면 로그인 모달이 렌더링 됩니다", () => {
    global.innerWidth = 480;

    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <LoginModalContextProvider>
          <UserContext.Provider
            value={{
              authState: mockAuthState.logout,
              setAuthState: mockSetAuthState,
            }}
          >
            <URLTestComponent />
            <App />
          </UserContext.Provider>
        </LoginModalContextProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("MainPage")).toBeInTheDocument();
    const pathName = screen.getByText("pathname is /");
    const button = screen.getByText("프로필");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByTestId("LoginModal")).toBeInTheDocument();
    expect(pathName.textContent).toBe("pathname is /");
  });
});
