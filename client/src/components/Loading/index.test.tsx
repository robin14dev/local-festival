import { render } from "@testing-library/react";
import React from "react";
import Loading from ".";
import "jest-styled-components";

describe("<Loading />", () => {
  it("텍스트를 포함하여 컴포넌트를 렌더링합니다", () => {
    const text = "Loading...";
    const { getByText, container } = render(<Loading text={text} />);

    expect(getByText(text)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("비디오 요소를 로딩 컴포넌트에 포함시켜 렌더링합니다.", () => {
    const text = "Loading...";
    const { getByTestId } = render(<Loading text={text} />);

    const videoElement = getByTestId("loading-video");
    expect(videoElement).toBeInTheDocument();
    expect(videoElement).toHaveAttribute("autoPlay");
    expect(videoElement).toHaveAttribute("loop");
    expect(videoElement).toHaveAttribute("playsInline");
    expect(videoElement).toHaveAttribute("width", "100%");
    expect(videoElement).toHaveAttribute("height", "100%");
  });
});
