import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React, { useContext } from "react";
import Festival from ".";
import {
  mockAuthState,
  mockFestivalItem,
  mockFestivalItems,
} from "../../test/mocks/mockData";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import DetailView from "../../pages/DetailView";
import {
  LoginModalContextProvider,
  LoginModalStateContext,
} from "../../contexts/LoginModalContext";
import { UserContext, UserContextProvider } from "../../contexts/userContext";
import LoginModal from "../account/LoginModal";
import {
  PickItemsContext,
  PickItemsContextProvider,
} from "../../contexts/PickItemsContext";
import {
  interceptAddPickItem,
  interceptDeletePickItem,
  interceptGetPickItems,
} from "../../test/mocks/mockServer/scope/pick";
import userEvent from "@testing-library/user-event";
import { interceptGetFestivalDetail } from "../../test/mocks/mockServer/scope/festival";
import { interceptGetReviews } from "../../test/mocks/mockServer/scope/review";
import { NoImage } from "../../assets";

afterEach(() => {
  window.sessionStorage.clear();
});

// TODO :  api 실패했을 때도 추가해 줘야됨
/**
 * 토큰 없는 경우 401
 *
 * 서버 에러 503
 *
 * 추가할 테스트는 찜 추가 해제할 때
 */

describe("<Festival/>", () => {
  test("컴포넌트가 성공적으로 렌더링 됩니다", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Festival festival={mockFestivalItem} />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });
  test("오늘 날짜를 기준으로, 축제 일정에 따라 [진행중], [예정], [종료] 상태를 나타내는 UI 가 정상적으로 렌더링 됩니다.", () => {
    const testCases = [
      { festival: mockFestivalItems.completed, expectedText: "종료" },
      { festival: mockFestivalItems.inProgress, expectedText: "진행중" },
      { festival: mockFestivalItems.scheduled, expectedText: "예정" },
    ];
    testCases.forEach(({ festival, expectedText }) => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Festival festival={festival} />
        </MemoryRouter>
      );
      expect(screen.getByText(expectedText)).toBeInTheDocument();
      cleanup();
    });
  });
  test("축제 썸네일 이미지가 없거나 유효하지 않은 url이면 기본 로고 이미지가 렌더링 됩니다.", () => {
    const validUrl =
      "https://images.unsplash.com/photo-1707343843344-011332037abb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    const testCases = [
      { festival: { ...mockFestivalItem, imageUrl: "" }, src: NoImage },
      {
        festival: { ...mockFestivalItem, imageUrl: "invalidUrl" },
        src: NoImage,
      },
      { festival: mockFestivalItem, src: validUrl },
    ];

    for (const { festival } of testCases) {
      const { container } = render(
        <MemoryRouter initialEntries={["/"]}>
          <Festival festival={festival} />
        </MemoryRouter>
      );

      const imgElement = screen.getByTestId("thumbnail");

      if (["", "invalidUrl"].includes(festival.imageUrl)) {
        fireEvent.error(imgElement);
        expect(imgElement).toHaveAttribute("src", NoImage);
      } else {
        fireEvent.load(imgElement);
        expect(imgElement).toHaveAttribute("src", validUrl);
      }
      expect(container).toMatchSnapshot();
      cleanup(); // 얘를 해줘야됨!!!
    }

    // testCases.forEach(({ festival }, i) => {
    //   const { container } = render(
    //     <MemoryRouter initialEntries={["/"]}>
    //       <Festival festival={festival} />
    //     </MemoryRouter>
    //   );
    //   console.log("TEST", i);
    //   console.dir(container);

    //   const imgElement = screen.getByTestId("thumbnail");

    //   if (festival.imageUrl === "") {
    //     fireEvent.error(imgElement);
    //     expect(imgElement).toHaveAttribute("src", NoImage);
    //   } else {
    //     fireEvent.load(imgElement);
    //     expect(imgElement).toHaveAttribute("src", validUrl);
    //   }
    // expect(container).toMatchSnapshot()

    // const { container } = render(
    //   <MemoryRouter initialEntries={["/"]}>
    //     <Festival festival={{ ...mockFestivalItem, imageUrl: "notvalidUrl" }} />
    //   </MemoryRouter>
    // );

    // const imgElement = screen.getByAltText(mockFestivalItem.title);
    // fireEvent.error(imgElement);
    // expect(imgElement).toHaveAttribute("src", NoImage);
    // expect(container).toMatchSnapshot();
  });
  test("컴포넌트 클릭시 상세페이지로 이동합니다", async () => {
    const interceptAPIOnDetailPage = () => {
      interceptGetFestivalDetail();
      interceptGetReviews();
    };
    const TestPageComponent = (): JSX.Element => {
      return <Festival festival={mockFestivalItem} />;
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
          <Route path="/Detail/:festivalId/*" element={<DetailView />} />
        </Routes>
      </MemoryRouter>
    );
    const pathname = screen.getByText("pathname is /Test");
    expect(pathname).toBeInTheDocument();
    interceptAPIOnDetailPage();
    userEvent.click(screen.getByTestId("Festival"));

    waitFor(async () => {
      expect(pathname.textContent).toBe("pathname is /Detail/1");
      const loading = await screen.findByText("상세페이지를 불러오고 있습니다");
      expect(loading).toBeInTheDocument();
    });
  });
  test("로그인 상태시, 하트를 클릭하면 해당 축제가 찜 추가 / 찜 해제가 됩니다", async () => {
    const testCases = [
      {
        type: "addPick",
        pickItemsOnStorage: JSON.stringify([]),
        numOfInitialPickItems: 0,
        numOfitemsAfterClick: 1,
      },
      {
        type: "deletePick",
        pickItemsOnStorage: JSON.stringify([mockFestivalItem]),
        numOfInitialPickItems: 1,
        numOfitemsAfterClick: 0,
      },
    ];

    const MockApp = () => {
      const {
        authState: { loginStatus },
      } = useContext(UserContext);
      const { pickItems } = useContext(PickItemsContext);
      return (
        <>
          <div>numOfPickItems is {pickItems.length}</div>
          {loginStatus ? "login" : "logout"}

          <Festival festival={mockFestivalItem} />
        </>
      );
    };

    window.sessionStorage.setItem("user", JSON.stringify(mockAuthState.login));
    render(
      <MemoryRouter initialEntries={["/"]}>
        <PickItemsContextProvider>
          <UserContextProvider>
            <MockApp />
          </UserContextProvider>
        </PickItemsContextProvider>
      </MemoryRouter>
    );

    const loginStatus = await screen.findByText("login");
    expect(loginStatus).toBeInTheDocument();
    for (const {
      type,
      pickItemsOnStorage,
      numOfInitialPickItems,
      numOfitemsAfterClick,
    } of testCases) {
      window.sessionStorage.setItem("picks", pickItemsOnStorage);
      const numOfPickItems = await screen.findByText(
        `numOfPickItems is ${numOfInitialPickItems}`
      );
      expect(JSON.parse(sessionStorage.getItem("picks") as string).length).toBe(
        numOfInitialPickItems
      );
      expect(numOfPickItems).toBeInTheDocument();
      const heart = screen.getByAltText("heart");
      if (type === "addPick") {
        interceptAddPickItem();
      } else if (type === "deletePick") {
        interceptDeletePickItem();
      }
      userEvent.click(heart);
      const element = await screen.findByText(
        `numOfPickItems is ${numOfitemsAfterClick}`
      );
      expect(element).toBeInTheDocument();
    }
  });
  test("로그인 상태시, 하트를 클릭하면 해당 축제가 찜 목록에 추가됩니다", async () => {
    //# 찜을 추가하는 경우
    window.sessionStorage.setItem("user", JSON.stringify(mockAuthState.login));
    window.sessionStorage.setItem("picks", JSON.stringify([]));

    const MockApp = () => {
      const {
        authState: { loginStatus },
      } = useContext(UserContext);
      const { pickItems } = useContext(PickItemsContext);
      return (
        <>
          <div>numOfPickItems is {pickItems.length}</div>
          {loginStatus ? "login" : "logout"}

          <Festival festival={mockFestivalItem} />
        </>
      );
    };

    interceptGetPickItems();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <PickItemsContextProvider>
          <UserContextProvider>
            <MockApp />
          </UserContextProvider>
        </PickItemsContextProvider>
      </MemoryRouter>
    );

    const loginStatus = await screen.findByText("login");
    expect(loginStatus).toBeInTheDocument();
    const numOfPickItems = await screen.findByText("numOfPickItems is 0");
    expect(numOfPickItems).toBeInTheDocument();
    const heart = screen.getByAltText("heart");

    interceptAddPickItem();

    userEvent.click(heart);

    const element = await screen.findByText("numOfPickItems is 1");
    expect(element).toBeInTheDocument();
  });
  test("로그인 상태시, 이미 찜한 축제의 하트를 클릭하면 찜 목록에서 해제됩니다", async () => {
    //# 찜을 해제 하는 경우
    window.sessionStorage.setItem("user", JSON.stringify(mockAuthState.login));
    window.sessionStorage.setItem("picks", JSON.stringify([mockFestivalItem]));

    const MockApp = () => {
      const {
        authState: { loginStatus },
      } = useContext(UserContext);
      const { pickItems } = useContext(PickItemsContext);
      return (
        <>
          <div>numOfPickItems is {pickItems.length}</div>
          {loginStatus ? "login" : "logout"}

          {pickItems.length && <Festival festival={pickItems[0]} />}
        </>
      );
    };

    render(
      <MemoryRouter initialEntries={["/"]}>
        <UserContextProvider>
          <PickItemsContextProvider>
            <MockApp />
          </PickItemsContextProvider>
        </UserContextProvider>
      </MemoryRouter>
    );

    expect(JSON.parse(sessionStorage.getItem("picks") as string).length).toBe(
      1
    );
    const loginStatus = await screen.findByText("login");
    expect(loginStatus).toBeInTheDocument();
    const numOfPickItems = await screen.findByText("numOfPickItems is 1");
    expect(numOfPickItems).toBeInTheDocument();
    const heart = screen.getByAltText("heart");

    interceptDeletePickItem();

    userEvent.click(heart);

    const element = await screen.findByText("numOfPickItems is 0");
    expect(element).toBeInTheDocument();
  });
  test("비 로그인 상태시, 하트를 클릭하면 로그인 모달이 나타납니다", () => {
    const MockApp = () => {
      const {
        authState: { loginStatus },
      } = useContext(UserContext);
      const isLoginModal = useContext(LoginModalStateContext);
      const { pathname } = useLocation();
      return (
        <>
          <div>pathname is {pathname}</div>
          {loginStatus ? "login" : "logout"}
          {isLoginModal && <LoginModal />}
          <Festival festival={mockFestivalItem} />
        </>
      );
    };
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <LoginModalContextProvider>
          <UserContextProvider>
            <MockApp />
          </UserContextProvider>
        </LoginModalContextProvider>
      </MemoryRouter>
    );
    expect(sessionStorage.getItem("user")).toBeNull();
    const pathname = screen.getByText("pathname is /");
    expect(pathname).toBeInTheDocument();
    const loginStatus = screen.getByText("logout");
    expect(loginStatus).toBeInTheDocument();
    const loginModal = screen.queryByTestId("LoginModal");
    expect(loginModal).toBeNull();
    const heart = screen.getByAltText("heart");
    fireEvent.click(heart);
    const renderedLoginModal = screen.getByTestId("LoginModal");
    expect(renderedLoginModal).toBeInTheDocument();
    expect(pathname.textContent).toBe("pathname is /");
    expect(container).toMatchSnapshot();
  });
});
