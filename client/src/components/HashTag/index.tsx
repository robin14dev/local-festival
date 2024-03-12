import React, { useEffect, useState } from "react";
import { Container, Button } from "./styled";

type HashtagProps = {
  onSearch: onSearchFunc;
  query: string | null;
  // setIsTag: React.Dispatch<React.SetStateAction<boolean>>;
};

const tagsArr = [
  {
    text: "봄나들이",
  },
  {
    text: "불빛축제",
  },
  {
    text: "역사탐방",
  },
];

const HashTag = ({ onSearch, query }: HashtagProps) => {
  const [curTag, setCurTag] = useState(query);

  // useEffect(() => {
  //   setCurTag(query);
  // }, [query]);

  return (
    <Container>
      {tagsArr.map((tag) => (
        <Button
          active={curTag === tag.text}
          onClick={() => {
            onSearch(tag.text);
            setCurTag(tag.text);
            // setIsTag(true);
          }}
          key={tag.text}
        >
          #{tag.text}
        </Button>
      ))}
    </Container>
  );
};

export default HashTag;
