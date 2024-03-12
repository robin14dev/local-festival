import React from "react";
import { render, screen } from "@testing-library/react";
import Search from ".";

describe("<Search />", () => {
  test("컴포넌트가 성공적으로 렌더링 됩니다.", () => {
    const { container } = render(<Search onSearch={jest.fn()} />);

    const searchInput = screen.getByRole("searchbox");
    const submitBtn = screen.getByRole("button");
    expect(searchInput).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
