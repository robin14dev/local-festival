import React from "react";
import {  render, screen, waitFor } from "@testing-library/react";
import HashTag from ".";
import userEvent from "@testing-library/user-event";


describe("<HashTag>", () => {

  test("컴포넌트가 성공적으로 렌더링 됩니다.", () => {
    const mockTagData = [{ text: "tag1" }, { text: "tag2" }, { text: "tag3" }];

    const { container } = render(
      <HashTag onSearch={jest.fn()} tagData={mockTagData} />
    );
    const hashTags = screen.getAllByRole("button");
    
    expect(hashTags).toHaveLength(mockTagData.length);
    expect(hashTags[0].textContent).toMatch(/^#+/)
    expect(container).toMatchSnapshot()
  });
  test("해시태그를 클릭시 해시태그의 텍스트가 인자로 들어간 콜백함수가 호출됩니다.", async() => {
    const mockTagData = [{ text: "tag1" }, { text: "tag2" }, { text: "tag3" }];
    const mockFunc = jest.fn()
    const user = userEvent.setup();
   render(
      <HashTag onSearch={mockFunc} tagData={mockTagData} />
    );
    const hashTags = screen.getAllByRole("button");
    for (const hashTag of hashTags) {
      await user.click(hashTag);
      
      expect(mockFunc).toHaveBeenCalledTimes(1);
      expect(mockFunc).toHaveBeenCalledWith(hashTag.textContent?.slice(1))
      mockFunc.mockClear()
    }
  }) 
  test("해시태그에 마우스를 가져다 대면 해당 해시태그의 스타일이 변경됩니다", async () => {
    const mockTagData = [{ text: "tag1" }, { text: "tag2" }, { text: "tag3" }];

    const user = userEvent.setup()
 render(
      <HashTag onSearch={jest.fn()} tagData={mockTagData} />
    );
    const hashTags = screen.getAllByRole("button");
    const hashTag = hashTags[0]
 
    let isHover = false
  
    hashTag.addEventListener('mouseover', () => {
      isHover = true
    })
    hashTag.addEventListener('mouseout', () => {
      isHover = false
    })
    expect(isHover).toBeFalsy()
    waitFor(() => {
      expect(hashTag).toHaveStyle({  backgroundColor: '#f5f6fa', color : 'black'})
    })

    await user.hover(hashTag)
  
    expect(isHover).toBeTruthy()
    expect(hashTag).toHaveStyle({  backgroundColor: '#6268ff', color : 'white' 
    })
  
    await user.unhover(hashTag)
  
    expect(isHover).toBeFalsy()
    waitFor(() => {
      expect(hashTag).toHaveStyle({  backgroundColor: '#f5f6fa', color : 'black'})
    })
  });
  test("해시태그를 클릭시 해당 요소의 스타일이 변경됩니다. 이후, 다른 해시태그를 클릭시, 클릭 되어있던 이전 해시태그의 스타일이 해제됩니다.", async() => {
    const mockTagData = [{ text: "tag1" }, { text: "tag2" }, { text: "tag3" }];
    const mockFunc = jest.fn()
    const user = userEvent.setup();
    render(
      <HashTag onSearch={mockFunc} tagData={mockTagData} />
    );
    const hashTags = screen.getAllByRole("button");
    const hashTag1= hashTags[0]
    const hashTag2 = hashTags[1];
    waitFor(() => {
      expect(hashTag1).toHaveStyle({  backgroundColor: '#f5f6fa', color : 'black'})
      expect(hashTag2).toHaveStyle({  backgroundColor: '#f5f6fa', color : 'black'})
    })
    await user.click(hashTag1)

    waitFor(() => {
      expect(hashTag1).toHaveStyle({  backgroundColor: '#6268ff', color : 'white' 
    })
    expect(hashTag2).toHaveStyle({  backgroundColor: '#f5f6fa', color : 'black'})

    })
    await user.click(hashTag2)
    waitFor(() => {
      expect(hashTag1).toHaveStyle({  backgroundColor: '#f5f6fa', color : 'black'})
      expect(hashTag2).toHaveStyle({  backgroundColor: '#6268ff', color : 'white' 

    })
  })
})
});
