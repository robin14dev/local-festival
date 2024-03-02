import React, { useContext, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Menu from "./Menu";
import { UserContext, UserContextProvider } from "../../contexts/userContext";
import { mockFestivalItem } from "../../test/mock";
import Wishlist from "../../pages/Wishlist";
import Main from "../../pages/Main";
import Account from "../../pages/Account";
beforeEach(() => {
  const intersectionObserverMock = () => ({
    observe: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = jest
    .fn()
    .mockImplementation(intersectionObserverMock);
});

const TestComponent = (): JSX.Element => {
  const { pathname } = useLocation();
  const {
    authState: { loginStatus },
  } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(true);
  const toggleDropdownMenu = (instruction: "show" | "hide"): void => {
    if (loginStatus) {
      return instruction === "show"
        ? setShowDropdown(true)
        : setShowDropdown(false);
    }
  };
  return (
    <>
      <div>pathname is {pathname}</div>
      <div>{loginStatus ? "로그인" : "로그아웃"}</div>
      {showDropdown && <Menu toggleDropdownMenu={toggleDropdownMenu} />}
    </>
  );
};

describe("Menu 컴포넌트", () => {
  it(" Menu 컴포넌트를 성공적으로 렌더링 합니다. ", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Menu toggleDropdownMenu={jest.fn()} />
      </MemoryRouter>
    );
    const menu = screen.getByTestId("Menu");
    expect(menu).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it("[계정] 메뉴 클릭시 계정 페이지로 이동합니다.", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <UserContextProvider>
          <TestComponent />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  filteredData={[mockFestivalItem]}
                  offset={{ current: 0 }}
                  setFestivalData={jest.fn()}
                  setFilteredData={jest.fn()}
                />
              }
            />
            <Route path="/Account" element={<Account />} />
          </Routes>
        </UserContextProvider>
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
    render(
      <MemoryRouter initialEntries={["/"]}>
        <UserContextProvider>
          <TestComponent />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  filteredData={[mockFestivalItem]}
                  offset={{ current: 0 }}
                  setFestivalData={jest.fn()}
                  setFilteredData={jest.fn()}
                />
              }
            />
            <Route path="/Wishlist" element={<Wishlist />} />
          </Routes>
        </UserContextProvider>
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
    const mockUser = {
      account: "123@gmail.com",
      nickname: "efwf",
      userId: 1,
      defaultPic: null,
      loginStatus: true,
    };
    window.sessionStorage.setItem("user", JSON.stringify(mockUser));
    render(
      <MemoryRouter initialEntries={["/Wishlist"]}>
        <UserContextProvider>
          <TestComponent />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  filteredData={[mockFestivalItem]}
                  offset={{ current: 0 }}
                  setFestivalData={jest.fn()}
                  setFilteredData={jest.fn()}
                />
              }
            />
            <Route path="/Wishlist" element={<Wishlist />} />
          </Routes>
        </UserContextProvider>
      </MemoryRouter>
    );

    const logoutBtn = screen.getByTestId("Menu-Logout");
    expect(logoutBtn).toBeInTheDocument();
    const wishListPage = screen.getByTestId("WishlistPage");
    const pathName = screen.getByText("pathname is /Wishlist");
    const loginStatus = screen.getByText("로그인");
    expect(window.sessionStorage.length).toBe(1);
    expect(wishListPage).toBeInTheDocument();
    expect(pathName).toBeInTheDocument();
    expect(loginStatus).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    expect(logoutBtn).not.toBeInTheDocument();
    const mainPage = screen.getByTestId("MainPage");
    expect(mainPage).toBeInTheDocument();
    expect(pathName.textContent).toBe("pathname is /");
    expect(loginStatus.textContent).toBe("로그아웃");
    expect(window.sessionStorage.getItem("user")).toBeNull();
  });
});
