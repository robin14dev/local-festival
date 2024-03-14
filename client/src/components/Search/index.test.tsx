import React from "react";
import Search from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<Search />", () => {
  test("컴포넌트가 성공적으로 렌더링 됩니다.", () => {
    const { container } = render(<Search onSearch={jest.fn()} />);
    const searchInput = screen.getByRole("searchbox");
    const submitBtn = screen.getByRole("button");
    expect(searchInput).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  test("input에 입력한 대로 input value가 렌더링이 됩니다", async () => {
    const user = userEvent.setup();
    const { container } = render(<Search onSearch={jest.fn()} />);
    const searchInput = screen.getByRole("searchbox");
    await user.click(searchInput);
    await user.keyboard("input onChagne test");

    expect(searchInput).toHaveValue("input onChagne test");

    expect(container).toMatchSnapshot();
  });
  test("input에 텍스트 입력 후, 검색 버튼을 클릭하면 핸들러 함수에 input value가 전달되어 호출됩니다.", async () => {
    const user = userEvent.setup();
    const mockFunc = jest.fn((x) => {
      console.log(x);
    });
    render(<Search onSearch={mockFunc} />);
    const searchInput = screen.getByRole("searchbox");
    const submitBtn = screen.getByRole("button");
    await user.click(searchInput);
    await user.keyboard("축제 텍스트 입력");
    await user.click(submitBtn);
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(mockFunc).toHaveBeenCalledWith("축제 텍스트 입력");
  });
});
