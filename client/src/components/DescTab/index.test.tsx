import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import DescTab from ".";
import { mockFestivalItem } from "../../test/mock";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

describe("<DescTab />", () => {
  it("데스크탑 환경에서 성공적으로 렌더링 됩니다", () => {
    /**
     * 이거는 상세페이지에서 렌더링을 해야되는거라서 이건 데스크탑 내에서만 되는걸로 해야겠네
     */
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <DescTab festival={mockFestivalItem} />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("DescTab")).toBeInTheDocument();
    expect(screen.getByText("축제 제목")).toBeInTheDocument();
    expect(screen.getByText("위치 정보")).toBeInTheDocument();
    expect(screen.getByText("2024년 01월 01일")).toBeInTheDocument();
    expect(screen.getByText("2024년 12월 31일")).toBeInTheDocument();
    expect(screen.getByText("축제 개요")).toBeInTheDocument();
    expect(screen.getByText("010-1234-5678")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("받아온 외부링크 별로 컴포넌트들이 성공적으로 렌더링 됩니다.", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <DescTab
          festival={{
            ...mockFestivalItem,
            homepageUrl: "https://www.instagram.com/seoul",
          }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("인스타그램 계정")).toBeInTheDocument();
  });
});
