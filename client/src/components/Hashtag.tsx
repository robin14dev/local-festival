import React from 'react';
import { useEffect, useState } from 'react';
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

const Button = styled.button<{ active: boolean }>`
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

type HashtagProps = {
  onSearch: onSearchFunc;
  query: string | null;
  setIsTag: React.Dispatch<React.SetStateAction<boolean>>;
};

const Hashtag = ({ onSearch, query, setIsTag }: HashtagProps) => {
  const [curTag, setCurTag] = useState(query);
  const tagsArr = [
    {
      text: '봄나들이',
    },
    {
      text: '불빛축제',
    },
    {
      text: '역사탐방',
    },
  ];

  useEffect(() => {
    setCurTag(query);
  }, [query]);

  return (
    <Wrapper>
      {tagsArr.map((tag) => (
        <Button
          active={curTag === tag.text}
          onClick={() => {
            onSearch(tag.text);
            setCurTag(tag.text);
            setIsTag(true);
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
