import React, { useRef, useState } from "react";
import { Container, Button } from "./styled";

type HashtagProps = {
  onSearch: onSearchFunc;
  tagData: TagData[];
};

type TagData = { text: string };

const HashTags = ({ onSearch, tagData }: HashtagProps) => {
  const { current: tags } = useRef(tagData);
  const [curTag, setCurTag] = useState("");

  return (
    <Container>
      {tags.map((tag) => (
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
    </Container>
  );
};

export default HashTags;
