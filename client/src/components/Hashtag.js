import React from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  height: 3rem;
  width: 100vw;
  background-color: white;
  position: fixed;
  top: 9rem;
  display: flex;
  justify-content: center;

  @media (max-width: 1210px) {
    width: 100vw;
  }
  @media (max-width: 1010px) {
    width: 100vw;
  }
  @media (max-width: 675px) {
    width: 100vw;
    /* margin-top: 1rem; */
    /* height: 30%; */
  }
  @media (max-width: 475px) {
    display: none;
  }
`;

const Button = styled.button`
  width: max-content;
  height: 38px;
  padding: 0.1rem 0.5rem;
  background: #f5f6fa;
  color: black;
  border-radius: 9px;
  margin-left: 1rem;
  font-size: 1rem;
  transition: all 0.1s ease-in;

  :hover {
    background-color: #6268ff;
    color: white;
  }

  ${(props) =>
    props.active &&
    css`
      background-color: #6268ff;
      color: white;
    `}
`;

const Hashtag = ({ onSearch }) => {
  const [SearchParams, setSearchParams] = useSearchParams();
  const [curTag, setCurTag] = useState(SearchParams.get('query'));
  const tagsArr = [
    {
      text: '가을꽃축제',
    },
    {
      text: '불빛축제',
    },
    {
      text: '역사탐방',
    },
    { text: '할로윈축제' },
  ];

  return (
    <Wrapper>
      {tagsArr.map((tag) => (
        <Button
          active={curTag === tag.text}
          onClick={() => {
            onSearch(tag.text);
            setCurTag(tag.text);
          }}
          key={tag.text}
        >
          #{tag.text}
        </Button>
      ))}
    </Wrapper>
  );
};

export default Hashtag;
