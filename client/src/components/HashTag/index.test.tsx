import React from "react";
import { render } from "@testing-library/react";
import HashTag from ".";

describe("<HashTag>", () => {
  test("🧪 컴포넌트가 성공적으로 렌더링 되는지 ", () => {
    const tagData = [{ text: "tag1" }, { text: "tag2" }, { text: "tag3" }];

    render(<HashTag onSearch={jest.fn()} query={""} />);
  });

  /*
  문제가 tagsArr이 컴포넌트에 의존적이다?

  props로 넘겨주는 방법도 굳이 그래야 하나 인 것 같기도 하고
  Main에서 넘겨주어야 하나... 별로 연관이 없는 데
  데이터를 불러오는걸로 해야 되는데 
  Main에 데이터파일을 만들고 

  원래 서버에서 호출해서 받아올 때 해시데이터가 뭔지도 받아와서 그걸 저장해 놓고 하는게 맞지 않나 그럼 ...?

  그럼 useEffect로 해시태그 목록을 불러와서 그걸 렌더링하는게 맞을 것 같은데 ??

  그럼 빈값으로 처음에 렌더링 되었다가 useEffect로 다시 렌더링 하고 이렇게 해야 하나??

  */

  test("🧪 클릭한 요소가 강조 효과 되는지? (css 테스트 되나??)", () => {});
});
