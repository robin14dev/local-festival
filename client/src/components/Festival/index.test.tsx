import { fireEvent, render, screen } from "@testing-library/react";
import React, { useContext } from "react";
import Festival, { getCurrentDate } from ".";
import { mockFestivalItem, mockFestivalItems } from "../../test/mock";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import DetailView from "../../pages/DetailView";
import {
  LoginModalContext,
  LoginModalContextProvider,
} from "../../contexts/LoginModalContext";
import { UserContextProvider } from "../../contexts/userContext";
import LoginModal from "../account/LoginModal";

describe("<Festival/>", () => {
  it("컴포넌트가 성공적으로 렌더링 됩니다", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Festival
          festival={mockFestivalItem}
          togglePick={jest.fn()}
          pickItems={[mockFestivalItem]}
        />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });
  it("오늘 날짜를 기준으로, 축제 일정에 따라 [진행중], [예정], [종료] 상태를 나타내는 UI 가 정상적으로 렌더링 됩니다.", () => {
    const testCases = [
      { festival: mockFestivalItems.completed, expectedText: "종료" },
      { festival: mockFestivalItems.inProgress, expectedText: "진행중" },
      { festival: mockFestivalItems.scheduled, expectedText: "예정" },
    ];

    testCases.forEach(({ festival, expectedText }) => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Festival
            festival={festival}
            togglePick={jest.fn()}
            pickItems={[mockFestivalItem]}
          />
        </MemoryRouter>
      );

      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });
  // it("축제 썸네일 이미지가 없거나 유효하지 않은 url이면 기본 로고 이미지가 렌더링 됩니다.", () => {
  //   // const testCases = [
  //   //   { festival: mockFestivalItems.completed, expectedText: "종료" },
  //   //   { festival: mockFestivalItems.inProgress, expectedText: "진행중" },
  //   //   { festival: mockFestivalItems.scheduled, expectedText: "예정" },
  //   // ];
  //   // testCases.forEach(({ festival, expectedText }) => {
  //   //   render(
  //   //     <MemoryRouter initialEntries={["/"]}>
  //   //       <Festival
  //   //         festival={festival}
  //   //         togglePick={jest.fn()}
  //   //         pickItems={[mockFestivalItem]}
  //   //       />
  //   //     </MemoryRouter>
  //   //   );
  //   //   expect(screen.getByText(expectedText)).toBeInTheDocument();
  //   // });
  // });
  it("컴포넌트 클릭시 상세페이지로 이동합니다", () => {
    const TestPageComponent = (): JSX.Element => {
      return (
        <>
          <Festival
            festival={mockFestivalItem}
            pickItems={[mockFestivalItem]}
            togglePick={jest.fn()}
          />
        </>
      );
    };

    const UrlCheck = (): JSX.Element => {
      const { pathname } = useLocation();
      return <div>pathname is {pathname}</div>;
    };

    render(
      <MemoryRouter initialEntries={["/Test"]}>
        <UrlCheck />
        <Routes>
          <Route path="/Test" element={<TestPageComponent />} />
          <Route
            path="/Detail/:festivalId"
            element={<DetailView togglePick={jest.fn()} />}
          />
        </Routes>
      </MemoryRouter>
    );

    const pathname = screen.getByText("pathname is /Test");
    expect(pathname).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("Festival"));
    expect(pathname.textContent).toBe("pathname is /Detail/1");
    expect(
      screen.getByText("상세페이지를 불러오고 있습니다")
    ).toBeInTheDocument();
  });
  it("로그인 상태시, 하트를 클릭하면 찜 목록에 추가되거나 해제 됩니다", () => {
    /**
     * TODO :찜목록 추가하는거 먼저 구현하고 forEach로 시나리오 만들어서 반복 없게 하기
     */
  });
  it("비 로그인 상태시, 하트를 클릭하면 로그인 모달이 나타납니다", () => {
    const MockApp = () => {
      const { isLoginModal } = useContext(LoginModalContext);

      return (
        <>
          {isLoginModal && <LoginModal setIsLoginModal={jest.fn()} />}
          <Festival
            festival={mockFestivalItem}
            togglePick={jest.fn}
            pickItems={[mockFestivalItem]}
          />
        </>
      );
    };
    render(
      <MemoryRouter initialEntries={["/"]}>
        <LoginModalContextProvider>
          <UserContextProvider>
            <MockApp />
          </UserContextProvider>
        </LoginModalContextProvider>
      </MemoryRouter>
    );

    const loginModal = screen.queryByTestId("LoginModal");
    expect(loginModal).toBeNull();
    const heart = screen.getByAltText("heart");

    fireEvent.click(heart);
    const renderedLoginModal = screen.getByTestId("LoginModal");
    expect(renderedLoginModal).toBeInTheDocument();
  });
});
