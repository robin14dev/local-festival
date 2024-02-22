import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from ".";

const mockFunction = jest.fn();

describe("<Header />", () => {
  it("중첩된 <Navigationbar/>를 포함하여 <Header/>를 성공적으로 렌더링 합니다", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header setIsLoginModal={mockFunction} />
      </MemoryRouter>
    );
    const logoElement = screen.getByText("LoCo");
    expect(logoElement).toBeInTheDocument();
    const navigationbarElement = screen.getByTestId("DropdownMenu");
    expect(navigationbarElement).toBeInTheDocument();
  });
  it('로고를 클릭하면 url이 "/"로 가게 합니다', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header setIsLoginModal={mockFunction} />
      </MemoryRouter>
    );

    const logoElement = screen.getByText("LoCo");
    fireEvent.click(logoElement);
    expect(window.location.pathname).toBe("/");
  });
});
